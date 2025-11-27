// src/test/github-search-engine.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GitHubSearchEngine } from '../lib/github-search-engine';
import { Buffer } from 'buffer';

// Mock the global fetch
global.fetch = vi.fn();

// Mock Buffer
global.Buffer = Buffer;

describe('GitHubSearchEngine', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should initialize with an API key', () => {
        const engine = new GitHubSearchEngine({ api_key: 'test_key' });
        // @ts-ignore
        expect(engine.apiKey).toBe('test_key');
    });

    it('should perform a search', async () => {
        const mockItems = [{ id: 1, full_name: 'test/repo' }];
        const mockResponse = {
            ok: true,
            status: 200,
            json: async () => ({ items: mockItems }),
            headers: new Headers(),
        };
        (fetch as any).mockResolvedValue(mockResponse);

        const engine = new GitHubSearchEngine();
        const results = await engine._searchGithub('test query');

        expect(fetch).toHaveBeenCalledWith(
            'https://api.github.com/search/repositories?q=test%20query&per_page=15',
            { headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "Local-Deep-Research-Agent",
            }}
        );
        expect(results).toEqual(mockItems);
    });

    it('should retrieve README content', async () => {
        const readmeContent = 'This is a test README.';
        const encodedContent = Buffer.from(readmeContent).toString('base64');
        const mockResponse = {
            ok: true,
            status: 200,
            json: async () => ({ content: encodedContent, encoding: 'base64' }),
        };
        (fetch as any).mockResolvedValue(mockResponse);

        const engine = new GitHubSearchEngine();
        const content = await engine._getReadmeContent('test/repo');

        expect(fetch).toHaveBeenCalledWith(
            'https://api.github.com/repos/test/repo/readme',
            { headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "Local-Deep-Research-Agent",
            } }
        );
        expect(content).toBe(readmeContent);
    });

    it('should handle API errors gracefully', async () => {
        const mockResponse = {
            ok: false,
            status: 403,
            statusText: 'Forbidden',
            headers: new Headers(),
        };
        (fetch as any).mockResolvedValue(mockResponse);

        const engine = new GitHubSearchEngine();
        const results = await engine._searchGithub('test query');

        expect(results).toEqual([]);
    });
});
