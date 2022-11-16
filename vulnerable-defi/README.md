# Damn Vulnerable DeFi - Truffle Box

This repo has some nice examples of defi contracts with vulnerabilities with different tests and examples of mitigation.

## Unstoppable Deployment

We can deploy the unstoppable contracts now with yarn commands.

### Arming and Disarming - NB

Don't forget to disarm the contracts after deplopying if you want to run them against a fuzzing service tool if it needs them armed with scribble annotations.

## Diligence Fuzzing Setup

You will need to install the requirements.txt into a python virtual environment with python 3.8.x or above in it. It's beyond the scope of this repo to teach you how to use that so go look here. This combo works really well:

* <https://github.com/pyenv/pyenv> - To manage python versions
* <https://github.com/pyenv/pyenv-virtualenv> - To create virtualenvs with them.

This will get you setup then you can create a virtual env for your repo and install the required python packages:

```shell
> pyenv install 3.8.13
> pyenv virtualenv 3.8.13 fuzzing-cli
> pyenv activate fuzzing-cli
> pip install -r requirements.txt
```

That should get you a nice isolated environment to run the fuzzer in.
