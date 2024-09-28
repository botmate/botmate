import { Table } from 'console-table-printer';
import dayjs from 'dayjs';
import inquirer from 'inquirer';
import ora from 'ora';

import { Application } from '../application';

export default function users(app: Application) {
  const users = app.cli.command('users');

  users
    .command('list')
    .description('list all users')
    .action(async () => {
      const loading = ora('loading users').start();

      const disconnectDb = await app.connectToDatabase();

      const users = await app.usersService.listUsers();

      loading.succeed(`${users.length} users found`);

      const u = new Table({
        columns: [
          { name: 'username', title: 'Username', alignment: 'left' },
          { name: 'createdAt', title: 'Created At', alignment: 'left' },
        ],
      });

      users.forEach((user) => {
        u.addRow({
          username: user.username,
          createdAt: dayjs(user.createdAt).format('MMM DD, HH:mm:ss'),
        });
      });

      u.printTable();

      await disconnectDb();
    });
  users
    .command('reset-password')
    .description('reset user password')
    .action(async () => {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: 'Username',
          default: 'admin',
        },
        {
          type: 'password',
          name: 'password',
          message: 'Password',
        },
        {
          type: 'password',
          name: 'confirmPassword',
          message: 'Confirm password',
        },
      ]);

      if (answers.password !== answers.confirmPassword) {
        console.error('Passwords do not match');
        return;
      }

      const loading = ora('resetting password').start();

      const disconnectDb = await app.connectToDatabase();

      try {
        await app.usersService.resetPassword(
          answers.username,
          answers.password,
        );
        loading.succeed('password reset successfully');
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
          console.error('Failed to reset password');
        }
      }

      await disconnectDb();
    });
}
