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

module.exports = (ComponentName) => {
  return {
    [`${ComponentName}.tsx`]: createJxsFile(ComponentName),
    [`${"index.module"}.less`]: createScssFile(ComponentName),
  };
};
