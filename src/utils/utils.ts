export function selectSpecificKeys(obj: any, keys: string[]): {[k: string]: any}{
    let selectedKeys: {[k: string]: string} = {};
    keys.forEach(key => {
        if(!(key in obj))
            return;

        const keyAndAlias = key.split(':');
        const multiKeys = keyAndAlias[0].split(' ');

        let value = obj;
        multiKeys.forEach(key => {
            value = value[key];
        })

        if(keyAndAlias && keyAndAlias.length > 1)
            key = keyAndAlias[1];
        
        selectedKeys[key] = value;
    });
    return selectedKeys;
}