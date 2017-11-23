const path = require('path');
const uservalidation =  require(path.join(__dirname, "../", '/modules/uservalidation.js'));

//verifyParameters
test('verifyParameters with all correct parameters returns true',()=>{
  expect(uservalidation.verifyParameters("Mario","Rossi","mario.rossi@email.it","password")).toBe(true);
});
test('verifyParameters without paramaters returns false',()=>{
  expect(uservalidation.verifyParameters()).toBe(false);
});
test('verifyParameters with not correct email returns false',()=>{
  expect(uservalidation.verifyParameters("Mario","Rossi","mario.rossi@email")).toBe(false);
});

//getPhone
test('getPhone with a possible number as integer returns the number',()=>{
  expect(uservalidation.getPhone(3333333333)).toBe("3333333333");
});
test('getPhone with a possible number as string returns the number',()=>{
  expect(uservalidation.getPhone("3333333333")).toBe("3333333333");
});
test('getPhone with a  badly formatted number returns the correct number',()=>{
  expect(uservalidation.getPhone(333.3333333)).toBe("3333333333");
});
test('getPhone without number returns -1',()=>{
  expect(uservalidation.getPhone()).toBe("-1");
});
test('getPhone with text returns -1',()=>{
  expect(uservalidation.getPhone("test")).toBe("-1");
});
test('getPhone with wrong number returns -1',()=>{
  expect(uservalidation.getPhone(333)).toBe("-1");
});

//getUserImage
test('getUserImage without parameter contains undefined',()=>{
  expect(uservalidation.getUserImage()).toContain(undefined);
});
