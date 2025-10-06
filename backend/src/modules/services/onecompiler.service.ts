import axios, { AxiosError } from "axios";
import https from "https";
import crypto from "crypto";
import { Logger } from "../config/logger";
import { ApiError } from "../types/ApiError";
import { CODE_EXECUTION_FAILED } from "../DTO/resDto/BaseErrorDto";

/**
 * Service for handling OneCompiler API integration
 * Manages code execution and language mapping
 */
export class OneCompilerService {
  // Lightweight in-memory cache to avoid duplicate calls within short window
  private static RESPONSE_CACHE: Map<string, { expiry: number; value: any }> = new Map();
  private readonly CACHE_TTL_MS = 10000; // 10s short-lived cache
  private readonly API_BASE_URL = process.env.ONECOMPILER_RUN_URL;
  private readonly API_KEY = process.env.ONECOMPILER_API_KEY;
  private readonly API_HOST = process.env.ONECOMPILER_HOST;
  private readonly TIMEOUT = 30000; // 30 seconds
  
  // Fixed HTTPS agent configuration for SSL/TLS issues
  private readonly httpsAgent = new https.Agent({
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.3',
    keepAlive: true,
    keepAliveMsecs: 1000,
    timeout: 30000,
  });

  /**
   * Language mapping from database language_id to OneCompiler IDs
   * Based on the database structure: language_id -> OneCompiler ID
   */
  private readonly LANGUAGE_MAPPING: Record<number, string> = {
    // Programming Languages
    1: 'python',        // Python
    2: 'python2',       // Python2
    3: 'javascript',    // JavaScript
    4: 'typescript',    // TypeScript
    5: 'java',          // Java
    6: 'c',             // C
    7: 'cpp',           // C++
    8: 'csharp',        // C#
    9: 'go',            // Go
    10: 'rust',         // Rust
    11: 'php',          // PHP
    12: 'ruby',         // Ruby
    13: 'bash',         // Bash
    14: 'lua',          // Lua
    15: 'haskell',      // Haskell
    16: 'ocaml',        // OCaml
    17: 'pascal',       // Pascal
    18: 'elixir',       // Elixir
    19: 'erlang',       // Erlang
    20: 'prolog',       // Prolog
    21: 'octave',       // Octave
    22: 'ada',          // Ada
    23: 'assembly',     // Assembly
    24: 'basic',        // Basic
    25: 'brainfk',      // BrainFK
    26: 'bun',          // Bun
    27: 'clojure',      // Clojure
    28: 'cobol',        // Cobol
    29: 'coffeescript', // CoffeeScript
    30: 'commonlisp',   // CommonLisp
    31: 'd',            // D
    32: 'dart',         // Dart
    33: 'deno',         // Deno
    34: 'ejs',          // EJS
    35: 'fsharp',       // F#
    36: 'fortran',      // Fortran
    37: 'groovy',       // Groovy
    38: 'jshell',       // JShell
    39: 'kotlin',       // Kotlin
    40: 'objectivec',   // Objective-C
    41: 'racket',       // Racket
    42: 'scala',        // Scala
    43: 'swift',        // Swift
    44: 'tcl',          // Tcl
    45: 'text',         // Text
    46: 'vb',           // Visual Basic (VB.NET)
    
    // Web Technologies
    47: 'html',         // HTML
    48: 'angular',      // Angular
    49: 'backbonejs',   // BackboneJS
    50: 'bootstrap',    // Bootstrap
    51: 'bulma',        // Bulma
    52: 'foundation',   // Foundation
    53: 'jquery',       // JQuery
    54: 'materialize',  // Materialize
    55: 'milligram',    // Milligram
    56: 'paperCss',     // PaperCSS
    57: 'react',        // React
    58: 'semanticUI',   // Semantic UI
    59: 'skeleton',     // Skeleton
    60: 'uikit',        // Uikit
    61: 'vue',          // Vue
    
    // Database Technologies
    62: 'mariadb',      // MariaDB
    63: 'sqlserver',    // Microsoft SQL Server
    64: 'mongodb',      // MongoDB
    65: 'mysql',        // MySQL
    66: 'oracle',       // Oracle Database
    67: 'plsql',        // Oracle PL/SQL
    68: 'postgresql',   // PostgreSQL
    69: 'redis',        // Redis
    70: 'sqlite',       // SQLite
  };

  public isLanguageSupported(languageId: string | number): boolean {
    try {
      this.getOneCompilerLanguageId(languageId);
      return true;
    } catch (error) {
      return false;
    }
  }

  public getOneCompilerLanguageId(languageId: string | number): string {
    if (typeof languageId === 'string') {
      const supportedLanguages = Object.values(this.LANGUAGE_MAPPING);
      if (!supportedLanguages.includes(languageId)) {
        throw new ApiError(400, CODE_EXECUTION_FAILED.error.message, `Unsupported language ID: ${languageId}`);
      }
      return languageId;
    }
    
    if (typeof languageId === 'number') {
      const oneCompilerId = this.LANGUAGE_MAPPING[languageId];
      if (!oneCompilerId) {
        throw new ApiError(400, CODE_EXECUTION_FAILED.error.message, `Unsupported database language_id: ${languageId}`);
      }
      return oneCompilerId;
    }
    
    throw new ApiError(400, CODE_EXECUTION_FAILED.error.message, `Invalid language ID type: ${typeof languageId}`);
  }

  public async executeCode(data: {
    source_code: string;
    language_id: string | number;
    stdin?: string;
    expected_output?: string;
  }): Promise<{
    stdout: string;
    stderr: string | null;
    exception: string | null;
    executionTime: number;
    status: string;
    error?: string;
  }> {
    try {
      if (!this.API_KEY) {
        throw new ApiError(500, CODE_EXECUTION_FAILED.error.message, 'OneCompiler API key not configured');
      }

      const oneCompilerLanguageId = this.getOneCompilerLanguageId(data.language_id);
      Logger.info(`Input language_id: ${data.language_id} -> OneCompiler ID: ${oneCompilerLanguageId}`);
      
      const requestData = {
        access_token: this.API_KEY,
        language: oneCompilerLanguageId,
        stdin: data.stdin || '',
        files: [
          {
            name: this.getFileName(oneCompilerLanguageId),
            content: data.source_code.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
          }
        ]
      };

      const url = `${this.API_BASE_URL}/run`;
      
      const cacheKey = this.buildCacheKey("single", {
        language: oneCompilerLanguageId,
        stdin: requestData.stdin,
        content: requestData.files[0]?.content || ""
      });
      const cached = this.getFromCache<{
        stdout: string;
        stderr: string | null;
        exception: string | null;
        executionTime: number;
        status: string;
      }>(cacheKey);
      if (cached) {
        return cached;
      }

      const options = {
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': this.API_HOST,
          'X-RapidAPI-Key': this.API_KEY,
        },
        data: requestData,
        timeout: this.TIMEOUT,
        httpsAgent: this.httpsAgent,
        validateStatus: (status) => status < 500,
      }
      
      const response = await axios.request(options);

      this.logRateLimit(response.headers as any);
      
      if (response.data.status === 'failed') {
        Logger.error(`OneCompiler execution failed: ${response.data.error || 'Unknown error'}`);
        throw new ApiError(500, CODE_EXECUTION_FAILED.error.message, response.data.error || 'Code execution failed');
      }

      const result = {
        stdout: response.data.stdout || '',
        stderr: response.data.stderr,
        exception: response.data.exception,
        executionTime: response.data.executionTime || 0,
        status: response.data.status
      };
      this.saveToCache(cacheKey, result);
      return result;

    } catch (error) {
      Logger.error(`OneCompiler error: ${(error as Error).message}`);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        Logger.error(`Axios error code=${axiosError.code} message=${axiosError.message}`);
        
        if (axiosError.response) {
          this.logRateLimit(axiosError.response.headers as any, true, axiosError.response.status, axiosError.response.statusText);
        } else if (axiosError.request) {
          Logger.error(`Network error: request made but no response received`);
          Logger.error(`Request details: ${JSON.stringify(axiosError.request, null, 2)}`);
        }
        
        if (axiosError.code === 'EPROTO' || axiosError.code === 'ERR_SSL_WRONG_VERSION_NUMBER') {
          Logger.error(`=== SSL/TLS Error ===`);
          Logger.error('SSL/TLS handshake failed. This might be due to:');
          Logger.error('1. Outdated Node.js version (update to latest LTS)');
          Logger.error('2. Server requiring specific TLS version');
          Logger.error('3. Certificate validation issues');
          Logger.error('4. Network connectivity problems');
        } else if (axiosError.code === 'ECONNREFUSED') {
          Logger.error(`=== Connection Refused ===`);
          Logger.error('Connection was refused. Check if OneCompiler API is accessible');
        } else if (axiosError.code === 'ETIMEDOUT') {
          Logger.error(`=== Timeout Error ===`);
          Logger.error('Request timed out. Check network connection and API response time');
        }
      } else {
        Logger.error(`=== Non-Axios Error ===`);
        Logger.error(`Error type: ${typeof error}`);
        Logger.error(`Error constructor: ${error?.constructor?.name}`);
      }
      
      throw new ApiError(500, CODE_EXECUTION_FAILED.error.message, `OneCompiler API error: ${(error as Error).message}`);
    }
  }

  /**
   * Execute code with multiple test cases (batch execution)
   */
  public async executeCodeBatch(data: {
    source_code: string;
    language_id: string | number;
    test_cases: Array<{
      input: string;
      expected_output?: string;
    }>;
  }): Promise<Array<{
    stdout: string;
    stderr: string | null;
    exception: string | null;
    executionTime: number;
    status: string;
    stdin: string;
    error?: string;
  }>> {
    try {
      if (!this.API_KEY) {
        throw new ApiError(500, CODE_EXECUTION_FAILED.error.message, 'OneCompiler API key not configured');
      }

      const oneCompilerLanguageId = this.getOneCompilerLanguageId(data.language_id);
      Logger.info(`Input language_id: ${data.language_id} -> OneCompiler ID: ${oneCompilerLanguageId}`);
      
      const requestData = {
        access_token: this.API_KEY,
        language: oneCompilerLanguageId,
        stdin: data.test_cases[0]?.input || '',
        files: [
          {
            name: this.getFileName(oneCompilerLanguageId),
            content: data.source_code.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
          }
        ]
      };

      const url = `${this.API_BASE_URL}/run`;
      
      const cacheKey = this.buildCacheKey("batch", {
        language: oneCompilerLanguageId,
        inputs: data.test_cases.map(tc => ({ in: tc.input, exp: tc.expected_output })),
        content: requestData.files[0]?.content || ""
      });
      const cached = this.getFromCache<Array<{
        stdout: string;
        stderr: string | null;
        exception: string | null;
        executionTime: number;
        status: string;
        stdin: string;
        error?: string;
      }>>(cacheKey);
      if (cached) {
        return cached;
      }

      const options = {
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': this.API_HOST,
          'X-RapidAPI-Key': this.API_KEY,
        },
        data: requestData,
        timeout: this.TIMEOUT,
        httpsAgent: this.httpsAgent,
        validateStatus: (status) => status < 500,
      }
      
      const response = await axios.request(options);
      this.logRateLimit(response.headers as any);
      
      if (Array.isArray(response.data)) {
        const results = response.data.map((result, index) => ({
          stdout: result.stdout || '',
          stderr: result.stderr,
          exception: result.exception,
          executionTime: result.executionTime || 0,
          status: result.status,
          stdin: result.stdin || data.test_cases[index]?.input || '',
          error: result.error
        }));
        this.saveToCache(cacheKey, results);
        return results;
      } else {
        return [{
          stdout: response.data.stdout || '',
          stderr: response.data.stderr,
          exception: response.data.exception,
          executionTime: response.data.executionTime || 0,
          status: response.data.status,
          stdin: data.test_cases[0]?.input || '',
          error: response.data.error
        }];
      }

    } catch (error) {
      Logger.error(`Error in OneCompiler executeCodeBatch: ${(error as Error).message}`);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          this.logRateLimit(axiosError.response.headers as any, true, axiosError.response.status, axiosError.response.statusText);
        }
      }
      
      throw new ApiError(500, CODE_EXECUTION_FAILED.error.message, `OneCompiler API error: ${(error as Error).message}`);
    }
  }

  /**
   * Get supported languages from OneCompiler API
   */
  public async getSupportedLanguages(): Promise<Array<{
    id: string;
    name: string;
    languageType: string;
    supportedFlags?: string;
  }>> {
    try {
      const url = `${this.API_BASE_URL}/languages`;
      
      const options = {
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': this.API_HOST,
          'X-RapidAPI-Key': this.API_KEY,
        },
        timeout: this.TIMEOUT,
        httpsAgent: this.httpsAgent,
        validateStatus: (status) => status < 500,
      }
      
      const response = await axios.request(options);
      this.logRateLimit(response.headers as any);

      const languages = response.data.map((lang: any) => ({
        id: lang.id,
        name: lang.name,
        languageType: lang.languageType,
        supportedFlags: lang.supportedFlags
      }));
      return languages;

    } catch (error) {
      Logger.error(`Error getting OneCompiler supported languages: ${(error as Error).message}`);
      throw new ApiError(500, CODE_EXECUTION_FAILED.error.message, `Failed to get supported languages: ${(error as Error).message}`);
    }
  }

  /**
   * Get appropriate file name for the language
   */
  private getFileName(languageId: string | number): string {
    const oneCompilerId = this.getOneCompilerLanguageId(languageId);
    const fileExtensions: Record<string, string> = {
      // Programming Languages
      'python': 'main.py',
      'python2': 'main.py',
      'javascript': 'main.js',
      'typescript': 'main.ts',
      'java': 'Main.java',
      'c': 'main.c',
      'cpp': 'main.cpp',
      'csharp': 'Program.cs',
      'go': 'main.go',
      'rust': 'main.rs',
      'php': 'main.php',
      'ruby': 'main.rb',
      'bash': 'main.sh',
      'lua': 'main.lua',
      'haskell': 'main.hs',
      'ocaml': 'main.ml',
      'pascal': 'main.pas',
      'elixir': 'main.ex',
      'erlang': 'main.erl',
      'prolog': 'main.pl',
      'octave': 'main.m',
      'ada': 'main.adb',
      'assembly': 'main.asm',
      'basic': 'main.bas',
      'brainfk': 'main.bf',
      'bun': 'main.js',
      'clojure': 'main.clj',
      'cobol': 'main.cob',
      'coffeescript': 'main.coffee',
      'commonlisp': 'main.lisp',
      'd': 'main.d',
      'dart': 'main.dart',
      'deno': 'main.ts',
      'ejs': 'main.ejs',
      'fsharp': 'main.fs',
      'fortran': 'main.f90',
      'groovy': 'main.groovy',
      'jshell': 'main.java',
      'kotlin': 'main.kt',
      'objectivec': 'main.m',
      'racket': 'main.rkt',
      'scala': 'main.scala',
      'swift': 'main.swift',
      'tcl': 'main.tcl',
      'text': 'main.txt',
      'vb': 'main.vb',
      
      // Web Technologies
      'html': 'index.html',
      'angular': 'app.component.ts',
      'backbonejs': 'main.js',
      'bootstrap': 'index.html',
      'bulma': 'index.html',
      'foundation': 'index.html',
      'jquery': 'main.js',
      'materialize': 'index.html',
      'milligram': 'index.html',
      'paperCss': 'index.html',
      'react': 'App.js',
      'semanticUI': 'index.html',
      'skeleton': 'index.html',
      'uikit': 'index.html',
      'vue': 'App.vue',
      
      // Database Technologies
      'mariadb': 'query.sql',
      'sqlserver': 'query.sql',
      'mongodb': 'query.js',
      'mysql': 'query.sql',
      'oracle': 'query.sql',
      'plsql': 'query.sql',
      'postgresql': 'query.sql',
      'redis': 'query.lua',
      'sqlite': 'query.sql'
    };

    return fileExtensions[oneCompilerId] || 'main.txt';
  }

  // =============================
  // Cache helpers
  // =============================
  private buildCacheKey(kind: 'single' | 'batch', payload: any): string {
    const hasher = crypto.createHash('sha1');
    hasher.update(kind);
    hasher.update('|');
    try {
      hasher.update(JSON.stringify(payload));
    } catch {
      hasher.update(String(payload));
    }
    return hasher.digest('hex');
  }

  private getFromCache<T>(key: string): T | null {
    const now = Date.now();
    const item = OneCompilerService.RESPONSE_CACHE.get(key);
    if (!item) return null;
    if (item.expiry < now) {
      OneCompilerService.RESPONSE_CACHE.delete(key);
      return null;
    }
    return item.value as T;
  }

  private saveToCache<T>(key: string, value: T): void {
    const now = Date.now();
    const expiry = now + this.CACHE_TTL_MS;
    
    if (OneCompilerService.RESPONSE_CACHE.size > 500) {
      const firstKey = OneCompilerService.RESPONSE_CACHE.keys().next().value;
      if (firstKey) OneCompilerService.RESPONSE_CACHE.delete(firstKey);
    }
    OneCompilerService.RESPONSE_CACHE.set(key, { expiry, value });
  }

  // =============================
  // Logging helpers
  // =============================
  private logRateLimit(headers: any, isError: boolean = false, status?: number, statusText?: string): void {
    try {
      const rlLimit = headers?.["x-ratelimit-requests-limit"]; 
      const rlRemain = headers?.["x-ratelimit-requests-remaining"]; 
      const msg = `rate-limit: limit=${rlLimit}, remaining=${rlRemain}`;
      if (isError && status) {
        Logger.error(`HTTP ${status} ${statusText} | ${msg}`);
      } else {
        Logger.info(msg);
      }
    } catch {
      // ignore logging errors
    }
  }
}