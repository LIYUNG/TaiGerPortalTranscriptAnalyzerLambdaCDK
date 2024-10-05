import { AWS_ACCOUNT } from "../configuration";
import { Region } from "./regions";

export enum Stage {
    Beta_FE = "Beta-FE",
    Prod_NA = "Prod-NA"
}

export const STAGES = [
    {
        stageName: Stage.Beta_FE,
        env: { region: Region.IAD, account: AWS_ACCOUNT },
        isProd: false
    },
    {
        stageName: Stage.Prod_NA,
        env: { region: Region.NRT, account: AWS_ACCOUNT },
        isProd: true
    }
];
