import _ from "lodash";

function getFirstAvailableKey(obj: any, keysArr: string[]): string | undefined {
    for(let i = 0; i < keysArr.length; i++){
        if(keysArr[i] in obj) return keysArr[i];
    }
    return;
}

export function selectSpecificKeys(obj: any, keys: string[], snakeToCameCase?: boolean): {[k: string]: any}{
    let selectedKeys: {[k: string]: string} = {};
    keys.forEach(key => {
        const keyAndAlias = key.split(':');
        const multiKeys = keyAndAlias[0].split(' ')
                            .map(key => key.split('>'))

        let value = obj;
        for(let i = 0; i < multiKeys.length; i++){
            const availableKey = getFirstAvailableKey(value, multiKeys[i]);
            if(availableKey){
                value = value[availableKey];
            }else{
                return;
            }
        }

        if(keyAndAlias && keyAndAlias.length > 1)
            key = keyAndAlias[1];

        if(snakeToCameCase)
            key = _.camelCase(key)
        
        selectedKeys[key] = value;
    });
    return selectedKeys;
}