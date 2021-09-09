const createJxsFile = (ComponentName) => {
  return `
      import React from 'react'
      const ${ComponentName} :React.FC = (props)=>{
          return () 
      } 

      export default ${ComponentName}
    `;
};
const createScssFile = (ComponentName) => {
  return `
      .${ComponentName} {

      } 
    `;
};
const createIndexFile = (ComponentName) => {
  return `
     import index from './${ComponentName}'
     
     export default index
    `;
};

module.exports = (ComponentName) => {
  return {
    [`${ComponentName}.tsx`]: createJxsFile(ComponentName),
    [`${ComponentName}.scss`]: createScssFile(ComponentName),
    [`index.js`]: createIndexFile(ComponentName),
  };
};
