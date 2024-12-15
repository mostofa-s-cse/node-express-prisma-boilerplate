module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.ts'], // Adjust this path if the file is not in the root directory
    moduleDirectories: ['node_modules', 'src'], // Add 'src' to resolve imports
    moduleFileExtensions: ['js', 'ts', 'json', 'node'],
};

process.env.JWT_SECRET = '7e3f5c3f79dbf61a3d8a653adba556b02d64fe8b4d3582d9e091d19ad173f71c0239b99d440adf5981db37bfa1ee6d24c9b8b3b02b6e54f38788a54756dbe1c5';
process.env.JWT_REFRESH_SECRET = '3921e3965702fa2e24508e2417a9a165d519a60b7a923d6b4a0044019f9f8b3ffdb4a68b97c5b365e5a46d8da720c44c04f230c4414c44243057fa6d4d19e563';
