import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			globals: globals.node,
		},
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				tsconfigRootDir: process.cwd(),
			},
			globals: globals.node,
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},
	// Separated type aware rules to avoid parsing errors for non project files
	{
		files: ['src/**/*.ts', 'src/**/*.tsx'],
		languageOptions: {
			parserOptions: {
				project: ['./tsconfig.json'],
				tsconfigRootDir: process.cwd(),
			},
		},
		rules: {
			...tsPlugin.configs['recommended-requiring-type-checking'].rules,
			...tsPlugin.configs['stylistic-type-checked'].rules,
			'@typescript-eslint/explicit-function-return-type': 'error',
		},
	},

	// Prettier configuration to avoid rule conflics with ESLint
	eslintConfigPrettier,
];
