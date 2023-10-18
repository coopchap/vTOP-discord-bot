import * as fsPromises from 'fs/promises';

const jsonFile = '/Users/CHAPPCOO000/Library/CloudStorage/OneDrive-HamiltonSoutheasternSchools/VS Code/vTOP/vTOP-discord-bot/tracking/nextID.json';

export async function getLastID(type) {
    const data = await fsPromises.readFile(jsonFile, 'utf-8');
    const json = JSON.parse(data);

    let result;
    if (type == 'bug') {
        result = json.bugID;
    } else if (type == 'feature') {
        result = json.featureID;
    } else if (type == 'improvement') {
        result = json.improvementID;
    }
    
    return result;
}

export async function writeNewID(type, newID) {
    const data = await fsPromises.readFile(jsonFile, 'utf-8');
    const json = JSON.parse(data);

    if (type == 'bug') {
        json.bugID = newID;
    } else if (type == 'feature') {
        json.featureID = newID;
    } else if (type == 'improvement') {
        json.improvementID = newID;
    }

    await fsPromises.writeFile(jsonFile, JSON.stringify(json, null, 2));
}