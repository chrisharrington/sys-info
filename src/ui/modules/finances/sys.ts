import Questrade from 'questrade';
import fs from 'fs';
import * as electron from 'electron';

import BaseModule from '../base/sys';

import history from './history.json';

export interface IFinancesInfo {
    total: number;
    change: number;
}

export class FinancesModules extends BaseModule<IFinancesInfo> {
    client: Questrade;
    accounts: string[] | null;

    constructor() {
        super(15*60*1000);

        const token = 'xgBxXvyaigenN4NCZwTGazJWW0DPEQre0';//process.env.FINANCES_REFRESH_TOKEN;
        this.client = new Questrade(token);
    }

    protected async get() : Promise<IFinancesInfo> {
        const accounts = await this.getAccounts();

        const balances = await Promise.all(accounts.map(this.getBalance.bind(this))) as any;
        const total = balances.reduce((sum, balance) => sum += balance, 0);
        console.log(total);

        return {
            total
        } as IFinancesInfo;
    }

    private async saveHistory() : Promise<void> {
        let localHistory = history;
        
    }

    private async getAccounts() : Promise<string[]> {
        if (this.accounts)
            return Promise.resolve(this.accounts);

        return new Promise<string[]>(resolve => {
            this.client.on('ready', () => {
                this.client.getAccounts((error: string, accounts: any) => {
                    resolve(this.accounts = Object.keys(accounts));
                });
            });
        });
    }

    private async getBalance(account: string) : Promise<number> {
        return new Promise<number>(resolve => {
            this.client.account = account;
            this.client.getBalances((error: string, balances: any) => {
                resolve(balances.combinedBalances.find(b => b.currency === 'CAD').totalEquity);
            });
        });
    }
}