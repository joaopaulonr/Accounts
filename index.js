const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');

option();

function option() {
    inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: 'Qual operação você deseja executar?',
            choices: [
                'Criar Conta',
                'Fechar sua conta',
                'Checar saldo',
                'Efetuar Saque',
                'Efetuar Depósito',
                'Sair'
            ]
        }])
        .then((answer) => {
            const action = answer['action'];
            if (action === 'Criar Conta') {
                createAccount();
            } else if (action === 'Fechar sua conta') {
                deleteAccount();
            } else if (action === 'Checar saldo') {
                checkBalance();
            } else if (action === 'Efetuar Saque') {
                withdraw();
            } else if (action === 'Efetuar Depósito') {
                deposit();
            } else if (action === 'Sair') {
                console.log(chalk.blue('bye'));
                process.exit();
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function createAccount() {
    console.log(chalk.bgGreen.black('Obrigado por usar nossos serviços'));
    console.log(chalk.green.bold('Defina as opções da sua conta a seguir:'));
    buildAccount();
}

function buildAccount() {
    inquirer.prompt([{
                type: 'input',
                name: 'name',
                message: 'Qual o nome da conta?'
            },
            {
                typeof: 'input',
                name: 'email',
                message: 'Qual o email da conta?'
            },
            {
                typeof: 'password',
                name: 'password',
                message: 'Qual a senha da conta?'
            }
        ])
        .then((answer) => {
            const name = answer['name'];
            const email = answer['email'];
            const password = answer['password'];
            console.info(chalk.green.bold(answer['name']));

            if (!fs.existsSync('accounts')) {
                fs.mkdirSync('accounts');
            }

            if (fs.existsSync(`acounts/${name}.json`)) {
                console.log(chalk.red.bold('Conta já existe'));
                buildAccount();
            } else {
                fs.writeFileSync(`accounts/${name}.json`, JSON.stringify({
                    name,
                    email,
                    password,
                    balance: 0
                }));
                console.log(chalk.green.bold('Conta criada com sucesso'));
                option();
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function deleteAccount() {
    console.log(chalk.bgGreen.black('Obrigado por usar nosso serviços'));
    console.log(chalk.green.bold('Para fechar sua conta informe seu nome a seguir:'));
    inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'Qual o nome da conta?'
        }])
        .then((answer) => {
            const name = answer['name'];
            if (fs.existsSync(`accounts/${name}.json`)) {
                fs.unlinkSync(`accounts/${name}.json`);
                console.log(chalk.green.bold('Conta excluída com sucesso'));
                option();
            } else {
                console.log(chalk.red.bold('Essa conta não existe!'));
                option();
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

function checkBalance() {
    inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'Qual o nome da conta?'
        }])
        .then((answer) => {
            const name = answer['name'];
            if (fs.existsSync(`accounts/${name}.json`)) {
                const account = JSON.parse(fs.readFileSync(`accounts/${name}.json`));
                console.log(chalk.green.bold(`Saldo da conta: \$${account.balance}`));
                option();
            } else {
                console.log(chalk.red.bold('Essa conta não existe!'));
                option();
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

function withdraw() {
    inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'Qual o nome da conta?'
        }])
        .then((answer) => {
            const name = answer['name'];
            if (fs.existsSync(`accounts/${name}.json`)) {
                inquirer.prompt([{
                        type: 'input',
                        name: 'amount',
                        message: 'Qual o valor a ser sacado?'
                    }])
                    .then((answer) => {
                        const amount = parseFloat(answer['amount']);
                        if (isNaN(amount) || amount < 0) {
                            console.log(chalk.red.bold('Valor inválido!'));
                            option();
                            return;
                        }
                        const accountData = JSON.parse(fs.readFileSync(`accounts/${name}.json`));
                        const currentBalance = accountData.balance;

                        if (amount > currentBalance) {
                            console.log(chalk.red.bold('Saldo insuficiente!'));
                            option();
                            return;
                        }
                        const updateBalance = currentBalance - amount;
                        accountData.balance = updateBalance;

                        fs.writeFileSync(`accounts/${name}.json`, JSON.stringify(accountData));

                        console.log(chalk.green.bold(`Saldo atualizado: \$${updateBalance}`));
                        option();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            } else {
                console.log(chalk.red.bold('Essa conta não existe!'));
                option();
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

function deposit() {
    inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'Qual o nome da conta?'
        }])
        .then((answer) => {
            const name = answer['name'];
            if (fs.existsSync(`accounts/${name}.json`)) {
                inquirer.prompt([{
                        type: 'input',
                        name: 'amount',
                        message: 'Qual o valor a ser depositado?'
                    }])
                    .then((answer) => {
                        const amount = parseFloat(answer['amount']);
                        if (isNaN(amount) || amount < 0) {
                            console.log(chalk.red.bold('Valor inválido!'));
                            option();
                            return;
                        }
                        const accountData = JSON.parse(fs.readFileSync(`accounts/${name}.json`));
                        const currentBalance = accountData.balance;

                        const updateBalance = currentBalance + amount;
                        accountData.balance = updateBalance;

                        fs.writeFileSync(`accounts/${name}.json`, JSON.stringify(accountData));

                        console.log(chalk.green.bold(`Saldo atualizado: \$${updateBalance}`));
                        option();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            } else {
                console.log(chalk.red.bold('Essa conta não existe!'));
                option();
            }
        })
        .catch((err) => {
            console.log(err);
        })
}
