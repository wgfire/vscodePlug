const createJxsFile = (ComponentName, template) => {
  if (template) return template;
  return `
     import React from 'react
     const ${ComponentName} :React.FC = (props)=>{
         return ()
     } 

     export default ${ComponentName}
    `;
};

const createScssFile = (ComponentName, template) => {
  if (template) return template;
  return `
    .${ComponentName} {

    }
    `;
};

module.exports = (ComponentName) => {
  return {
    [`${ComponentName}.tsx`]: createJxsFile(ComponentName),
    [`${ComponentName}.scss`]: createScssFile(ComponentName),
  };
};
