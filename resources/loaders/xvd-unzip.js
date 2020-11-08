const path = require('path');
const AdmZip = require('adm-zip');

const join = path.join;

const rootFileName = 'main.json';

const getPortionFile = (root, id) => {
  return join(root, `portions/${id}/content.json`);
}
const getMaterialFile = (root, contentId, materialId) => {
  return join(root, `portions/${contentId}/materials/${materialId}.json`);
}

const toObject = zipEntry => {
  if (!zipEntry) return null;
  return JSON.parse(zipEntry.getData().toString('utf8'));
}

const unzip = (zipPath) => {
  const zip = new AdmZip(zipPath);
  const zipEntries = zip.getEntries();
  const root = zipEntries[0].entryName;
  const dataMain = toObject(zipEntries.find(item => item.entryName === join(root, rootFileName)));

  const dataPortions = dataMain.portions.map(item => {
    const portionPath = getPortionFile(root, item.id);
    // 提取 content
    const content = toObject(zipEntries.find(itemSub => itemSub.entryName === portionPath));
    // 提取 materials
    const materials = content.materials.map(materialId => {
      const materialPath = getMaterialFile(root, item.id, materialId);
      return toObject(zipEntries.find(material => material.entryName === materialPath));
    }).filter(itemSub => !!itemSub);

    return {
      content,
      materials
    };
  }).filter(item => !!item);
  return {
    main: dataMain,
    portions: dataPortions
  }  
}

module.exports = unzip;
