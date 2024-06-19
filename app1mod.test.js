const getGreeting = require('./app1mod');

test('"Hello World!"', () => {
    const result = getGreeting();
    expect(result).toBe("Hello World!");
});
