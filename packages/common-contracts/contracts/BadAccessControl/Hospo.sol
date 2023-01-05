pragma solidity ^0.8.12;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

contract Hospo is ERC20, Ownable {
    using SafeMath for uint256;

    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair;

    bool private swapping;

    bool public isTradingEnabled;
    bool public isAntiBotEnabled;
    uint256 public tradingStartBlock;

    uint256 private lastBlock;
    uint8 public constant BLOCKCOUNT = 100;

    struct BuyFee {
        uint16 devFee;
        uint16 liquidityFee;
    }

    struct SellFee {
        uint16 devFee;
        uint16 liquidityFee;
    }

    BuyFee public buyFee;
    SellFee public sellFee;
    uint16 private totalBuyFee;
    uint16 private totalSellFee;

    address private constant deadWallet = address(0xdead);

    uint256 public swapTokensAtAmount = 2 * 10**8 * (10**18);
    uint256 public maxTxAmount = 22 * 10**9 * 10**18;
    uint256 public maxWalletAmount = 22 * 10**10 * 10**18;

    uint256 public dailyCap = 20 ether;
    mapping(address => uint256) private lastSoldTime;
    mapping(address => uint256) public soldTokenin24Hrs;

    address payable public _devWallet = payable(address(0xb4eCfD43b81d13F9E511Ee0FfD2D8a6BDFe76EEf));

    mapping(address => bool) public _isBlackListed;
    // exlcude from fees and max transaction amount
    mapping(address => bool) private _isExcludedFromFees;

    // store addresses that a automatic market maker pairs. Any transfer *to* these addresses
    // could be subject to a maximum transfer amount
    mapping(address => bool) public automatedMarketMakerPairs;

    event UpdateDividendTracker(
        address indexed newAddress,
        address indexed oldAddress
    );

    event UpdateUniswapV2Router(
        address indexed newAddress,
        address indexed oldAddress
    );

    event ExcludeFromFees(address indexed account, bool isExcluded);
    event ExcludeMultipleAccountsFromFees(address[] accounts, bool isExcluded);

    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);

    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiqudity
    );

    constructor() ERC20("HospoWise", "HOSPO") {
        sellFee.devFee = 35;
        sellFee.liquidityFee = 10;
        totalSellFee = 45;

        buyFee.devFee = 35;
        buyFee.liquidityFee = 10;
        totalBuyFee = 45;

        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(
            0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
        );
        // Create a uniswap pair for this new token
        address _uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
        .createPair(address(this), _uniswapV2Router.WETH());

        uniswapV2Router = _uniswapV2Router;
        uniswapV2Pair = _uniswapV2Pair;

        _setAutomatedMarketMakerPair(_uniswapV2Pair, true);

        // exclude from paying fees or having max transaction amount
        excludeFromFees(owner(), true);
        excludeFromFees(_devWallet, true);
        excludeFromFees(address(this), true);

        /*
            _mint is an internal function in ERC20.sol that is only called here,
            and CANNOT be called ever again
        */
        _mint(owner(), 22_000_000_000_001 * (10**18)); //22,000,000,000,001 tokens
    }

    receive() external payable {}

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function setAntibot(bool value) external onlyOwner {
        isAntiBotEnabled = value;
    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }

    function updateRouter(address newAddress) external onlyOwner {
        require(
            newAddress != address(uniswapV2Router),
            "Hospo: The router already has that address"
        );
        uniswapV2Router = IUniswapV2Router02(newAddress);
        address get_pair = IUniswapV2Factory(uniswapV2Router.factory()).getPair(
            address(this),
            uniswapV2Router.WETH()
        );
        if (get_pair == address(0)) {
            uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory())
            .createPair(address(this), uniswapV2Router.WETH());
        } else {
            uniswapV2Pair = get_pair;
        }
    }

    function claimStuckTokens(address _token) external onlyOwner {
        if (_token == address(0x0)) {
            payable(owner()).transfer(address(this).balance);
            return;
        }
        IERC20 erc20token = IERC20(_token);
        uint256 balance = erc20token.balanceOf(address(this));
        erc20token.transfer(owner(), balance);
    }

    function excludeFromFees(address account, bool excluded) public onlyOwner {
        require(
            _isExcludedFromFees[account] != excluded,
            "Hospo: Account is already excluded"
        );
        _isExcludedFromFees[account] = excluded;

        emit ExcludeFromFees(account, excluded);
    }

    function excludeMultipleAccountsFromFees(
        address[] calldata accounts,
        bool excluded
    ) public onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            _isExcludedFromFees[accounts[i]] = excluded;
        }

        emit ExcludeMultipleAccountsFromFees(accounts, excluded);
    }

    function setDevWallet(address payable wallet) external onlyOwner {
        require(wallet != address(0), "dev wallet address can't be zero");
        _devWallet = wallet;
    }

    function setSwapAtAmount(uint256 value) external onlyOwner {
        require(value > 2000000, "should be greator than 2 million tokens");
        swapTokensAtAmount = value * 10**18;
    }

    function setMaxWallet(uint256 value) external onlyOwner {
        require(
            value > 2200000001,
            " amount should be greator than 0.01% of the supply"
        );
        maxWalletAmount = value * 10**18;
    }

    function setMaxTx(uint256 value) external onlyOwner {
        require(
            value > 2200000001,
            " amount should be greator than 0.01% of the supply"
        );
        maxTxAmount = value * 10**18;
    }


    function setBlackList(address addr, bool value) external onlyOwner {
        _isBlackListed[addr] = value;
    }

    function setDailyCap(uint256 value) external onlyOwner {
        require (value > 10, "cap should more than 10 ether");
        dailyCap = value * 10**18;
    }

    function setAutomatedMarketMakerPair(address pair, bool value)
    public
    onlyOwner
    {
        require(
            pair != uniswapV2Pair,
            "Hospo: The PancakeSwap pair cannot be removed from automatedMarketMakerPairs"
        );

        _setAutomatedMarketMakerPair(pair, value);
    }

    function _setAutomatedMarketMakerPair(address pair, bool value) private {
        require(
            automatedMarketMakerPairs[pair] != value,
            "Hospo: Automated market maker pair is already set to that value"
        );
        automatedMarketMakerPairs[pair] = value;

        emit SetAutomatedMarketMakerPair(pair, value);
    }

    //   call this function before starting presale
    function prepareForPresale(address presaleAddress) external onlyOwner {
        buyFee.devFee = 0;
        buyFee.liquidityFee = 0;
        sellFee.devFee = 0;
        sellFee.liquidityFee = 0;
        _isExcludedFromFees[presaleAddress] = true;
    }

    // call this function once liquiidity is added
    function startTrading() external onlyOwner {
        buyFee.devFee = 35;
        buyFee.liquidityFee = 10;
        sellFee.devFee = 35;
        sellFee.liquidityFee = 10;
        isTradingEnabled = true;
        tradingStartBlock = block.number;
    }

    function isExcludedFromFees(address account) public view returns (bool) {
        return _isExcludedFromFees[account];
    }

    function _transferIGNORE(
        address from,
        address to,
        uint256 amount
    ) internal {
        require(from != address(0), "ERC20: transfer from the zero address");

        require(
            !_isBlackListed[from] && !_isBlackListed[to],
            "Account is blacklisted"
        );

        if (amount == 0) {
            super._transfer(from, to, 0);
            return;
        }

        uint256 contractTokenBalance = balanceOf(address(this));

        bool canSwap = contractTokenBalance >= swapTokensAtAmount;

        if (
            canSwap &&
            !swapping &&
            !automatedMarketMakerPairs[from] &&
            from != owner() &&
            to != owner()
        ) {
            swapping = true;

            contractTokenBalance = swapTokensAtAmount;

            uint256 swapTokens = contractTokenBalance
            .mul(sellFee.liquidityFee)
            .div(totalBuyFee + totalSellFee);
            if (swapTokens > 0) {
                swapAndLiquify(swapTokens);
            }

            uint256 feeTokens = contractTokenBalance - swapTokens;
            if (feeTokens > 0) {
                super._transfer(address(this), _devWallet, feeTokens);
            }

            swapping = false;
        }

        bool takeFee = !swapping;

        // if any account belongs to _isExcludedFromFee account then remove the fee
        if (_isExcludedFromFees[from] || _isExcludedFromFees[to]) {
            takeFee = false;
        }

        if (takeFee) {
            require(amount <= maxTxAmount, "Amount exceeds limit");
            if (isAntiBotEnabled) {
                require(block.number > lastBlock, "One transfer per block");

                lastBlock = block.number;
            }

            if (!automatedMarketMakerPairs[to]) {
                require(
                    balanceOf(to) + amount <= maxWalletAmount,
                    "Balance exceeds limit"
                );
            }

            uint256 fees;

            if (automatedMarketMakerPairs[to]) {
                require(isTradingEnabled, "Trading not enabled yet");
                fees = totalSellFee;

                if (block.timestamp - lastSoldTime[from] > 1 days) {
                    lastSoldTime[from] = block.timestamp;
                    soldTokenin24Hrs[from] = 0;
                }
                uint256 ethAmount = getPriceOfToken(amount);
                require(
                    soldTokenin24Hrs[from] + ethAmount < dailyCap,
                    "Token amount exceeds daily sell limit"
                );

                soldTokenin24Hrs[from] = soldTokenin24Hrs[from].add(ethAmount);

            } else if (automatedMarketMakerPairs[from]) {
                if (block.number < tradingStartBlock + BLOCKCOUNT) {
                    _isBlackListed[to] = true;
                }
                fees = totalBuyFee;
            }
            uint256 feeAmount = amount.mul(fees).div(1000);

            amount = amount.sub(feeAmount);

            super._transfer(from, address(this), feeAmount);
        }

        super._transfer(from, to, amount);
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        // approve token transfer to cover all possible scenarios
        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // add the liquidity
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            address(0xdead),
            block.timestamp
        );
    }

    /**
     * @dev TEST METHOD TO HELP US ADD LIQUIDITY EASY
     */
    function testSetup(uint256 tokenAmount, uint256 ethAmount) public onlyOwner {
        // this wil fail...
        addLiquidity(tokenAmount, ethAmount);
    }

    function swapAndLiquify(uint256 tokens) private {
        // split the contract balance into halves
        uint256 half = tokens.div(2);
        uint256 otherHalf = tokens.sub(half);

        uint256 initialBalance = address(this).balance;

        // swap tokens for ETH
        swapTokensForETH(half); // <- this breaks the ETH -> HATE swap when swap+liquify is triggered

        // how much ETH did we just swap into?
        uint256 newBalance = address(this).balance.sub(initialBalance);
        // add liquidity to uniswap
        addLiquidity(otherHalf, newBalance);

        emit SwapAndLiquify(half, newBalance, otherHalf);
    }

    function swapTokensForETH(uint256 tokenAmount) private {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();

        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
    }

    function getPriceOfToken(uint256 amount)
    public
    view
    returns (uint256 price)
    {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();

        price = (uniswapV2Router.getAmountsOut(amount, path))[path.length - 1];
    }
}
