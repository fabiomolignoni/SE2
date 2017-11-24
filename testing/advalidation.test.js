const path = require('path');
const advalidation =  require(path.join(__dirname, "../", '/modules/advalidation.js'));

//isValidCategory
test('isValidCategory with a valid category returns true',()=>{
  expect(advalidation.isValidCategory("appunti")).toBe(true);
});
test('isValidCategory with a invalid category returns false',()=>{
  expect(advalidation.isValidCategory("invalid")).toBe(false);
});
//verifyParameters
test('verifyParameters with all correct parameters returns true',()=>{
  expect(advalidation.verifyParameters("Appunti analisi","Descrizione","3.10","appunti")).toBe(true);
});
test('verifyParameters without paramaters returns false',()=>{
  expect(advalidation.verifyParameters()).toBe(false);
});
test('verifyParameters with invalid price returns false',()=>{
  expect(advalidation.verifyParameters("Appunti analisi","Descrizione","3.10.05","appunti")).toBe(false);
});
test('verifyParameters with invalid category returns false',()=>{
  expect(advalidation.verifyParameters("Appunti analisi","Descrizione","3.10","note")).toBe(false);
});
//getAdImage
test('getAdImage without image returns undefined',()=>{
  expect(advalidation.getAdImage()).toContain(undefined);
});

//getAdImage
test('getDefaultAdImage returns the default image',()=>{
  expect(advalidation.getDefaultAdImage()).toContain("image/jpg");
});
