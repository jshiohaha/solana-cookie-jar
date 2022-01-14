const registry = require('@solana/spl-token-registry');
const fs = require('fs');

const main = async () => {
    new registry.TokenListProvider().resolve().then((tokens: any) => {
        [registry.ENV.MainnetBeta, registry.ENV.Testnet, registry.ENV.Devnet].forEach((env) => {
            const tokenList = tokens.filterByChainId(env).getList();
            const tokenMap = tokenList.reduce((map: any, item: any) => {
                map.set(item.address, item);
                return map;
            }, new Map());

            let jsonObj: any = {};
            tokenMap.forEach((value: any, key: any) => {
                jsonObj[key] = value;
            });

            console.log(`Writing to tokens to file for env = [${env}]`);

            // write token list to file
            fs.writeFileSync(`./src/data/tokens/${env}/tokens.json`, JSON.stringify(jsonObj));
        });
    });
};

main()
    .then(() => console.log('Finished updating token lists'))
    .catch((err: any) => console.log('err: ', err));
