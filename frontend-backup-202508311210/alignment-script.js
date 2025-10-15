#!/usr/bin/env node

/**
 * Frontend-Backend Alignment Script
 * This script helps synchronize your frontend and backend configurations
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

class FrontendBackendAligner {
    constructor(config = {}) {
        this.config = {
            backendUrl: config.backendUrl || 'http://localhost:3000',
            frontendPath: config.frontendPath || './frontend',
            backendPath: config.backendPath || './backend',
            apiPrefix: config.apiPrefix || '/api',
            outputFile: config.outputFile || 'alignment-report.json',
            ...config
        };
        
        this.endpoints = [];
        this.frontendRoutes = [];
        this.issues = [];
        this.report = {};
    }

    // Discover backend API endpoints
    async discoverBackendEndpoints() {
        console.log('🔍 Discovering backend endpoints...');
        
        const commonEndpoints = [
            '/api/parts',
            '/api/labor', 
            '/api/settings',
            '/api/timeclock/status',
            '/api/timeclock/clock-in',
            '/api/customers',
            '/api/auth/login',
            '/api/auth/logout',
            '/api/users',
            '/api/health'
        ];

        for (const endpoint of commonEndpoints) {
            try {
                const response = await axios.get(`${this.config.backendUrl}${endpoint}`, {
                    timeout: 5000,
                    validateStatus: () => true // Accept any status code
                });
                
                this.endpoints.push({
                    path: endpoint,
                    method: 'GET',
                    status: response.status,
                    available: response.status < 500,
                    requiresAuth: response.status === 401,
                    data: response.data
                });
                
                console.log(`  ✅ ${endpoint} - Status: ${response.status}`);
            } catch (error) {
                this.endpoints.push({
                    path: endpoint,
                    method: 'GET',
                    status: 'ERROR',
                    available: false,
                    error: error.message
                });
                console.log(`  ❌ ${endpoint} - Error: ${error.message}`);
            }
        }
    }

    // Scan frontend for API calls
    scanFrontendApiCalls() {
        console.log('📱 Scanning frontend API calls...');
        
        const frontendFiles = this.getAllFiles(this.config.frontendPath, ['.js', '.ts', '.jsx', '.tsx', '.vue']);
        
        frontendFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf8');
            
            // Look for API calls (fetch, axios, etc.)
            const apiPatterns = [
                /fetch\s*\(\s*['"`]([^'"`]+)['"`]/g,
                /axios\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
                /\.get\s*\(\s*['"`]([^'"`]+)['"`]/g,
                /\.post\s*\(\s*['"`]([^'"`]+)['"`]/g,
                /api\s*:\s*['"`]([^'"`]+)['"`]/g
            ];
            
            apiPatterns.forEach(pattern => {
                let match;
                while ((match = pattern.exec(content)) !== null) {
                    const url = match[1] || match[2];
                    if (url && (url.startsWith('/api') || url.includes('api'))) {
                        this.frontendRoutes.push({
                            file: path.relative(process.cwd(), file),
                            url: url,
                            method: match[0].includes('post') ? 'POST' : 
                                   match[0].includes('put') ? 'PUT' :
                                   match[0].includes('delete') ? 'DELETE' :
                                   match[0].includes('patch') ? 'PATCH' : 'GET',
                            line: content.substring(0, match.index).split('\n').length
                        });
                    }
                }
            });
        });
        
        console.log(`  Found ${this.frontendRoutes.length} API calls in frontend`);
    }

    // Find alignment issues
    findAlignmentIssues() {
        console.log('🔍 Analyzing alignment issues...');
        
        // Find frontend calls to non-existent backend endpoints
        this.frontendRoutes.forEach(route => {
            const backendEndpoint = this.endpoints.find(ep => 
                ep.path === route.url || ep.path.includes(route.url.replace('/api', ''))
            );
            
            if (!backendEndpoint) {
                this.issues.push({
                    type: 'MISSING_BACKEND_ENDPOINT',
                    severity: 'HIGH',
                    message: `Frontend calls ${route.url} but backend endpoint not found`,
                    frontend: route,
                    suggestion: `Create backend endpoint: ${route.url}`
                });
            } else if (!backendEndpoint.available) {
                this.issues.push({
                    type: 'UNAVAILABLE_ENDPOINT',
                    severity: 'HIGH',
                    message: `Backend endpoint ${route.url} is not available (Status: ${backendEndpoint.status})`,
                    frontend: route,
                    backend: backendEndpoint,
                    suggestion: 'Fix backend endpoint implementation'
                });
            } else if (backendEndpoint.requiresAuth) {
                this.issues.push({
                    type: 'AUTH_REQUIRED',
                    severity: 'MEDIUM',
                    message: `Endpoint ${route.url} requires authentication`,
                    frontend: route,
                    backend: backendEndpoint,
                    suggestion: 'Ensure frontend sends authentication headers'
                });
            }
        });
        
        // Find unused backend endpoints
        this.endpoints.forEach(endpoint => {
            const frontendCall = this.frontendRoutes.find(route => 
                route.url === endpoint.path || route.url.includes(endpoint.path.replace('/api', ''))
            );
            
            if (!frontendCall && endpoint.available) {
                this.issues.push({
                    type: 'UNUSED_BACKEND_ENDPOINT',
                    severity: 'LOW',
                    message: `Backend endpoint ${endpoint.path} is not used by frontend`,
                    backend: endpoint,
                    suggestion: 'Consider removing unused endpoint or add frontend integration'
                });
            }
        });
        
        console.log(`  Found ${this.issues.length} alignment issues`);
    }

    // Generate alignment fixes
    generateAlignmentFixes() {
        console.log('🔧 Generating alignment fixes...');
        
        const fixes = {
            backend: [],
            frontend: [],
            configuration: []
        };
        
        this.issues.forEach(issue => {
            switch (issue.type) {
                case 'MISSING_BACKEND_ENDPOINT':
                    fixes.backend.push({
                        action: 'CREATE_ENDPOINT',
                        path: issue.frontend.url,
                        method: issue.frontend.method,
                        template: this.generateBackendEndpointTemplate(issue.frontend)
                    });
                    break;
                    
                case 'UNAVAILABLE_ENDPOINT':
                    fixes.backend.push({
                        action: 'FIX_ENDPOINT',
                        path: issue.backend.path,
                        currentStatus: issue.backend.status,
                        suggestion: 'Check endpoint implementation and dependencies'
                    });
                    break;
                    
                case 'AUTH_REQUIRED':
                    fixes.frontend.push({
                        action: 'ADD_AUTH_HEADERS',
                        file: issue.frontend.file,
                        line: issue.frontend.line,
                        template: this.generateAuthHeaderTemplate()
                    });
                    break;
            }
        });
        
        return fixes;
    }

    // Generate backend endpoint template
    generateBackendEndpointTemplate(frontendRoute) {
        const method = frontendRoute.method.toLowerCase();
        const path = frontendRoute.url.replace('/api', '');
        
        return `
// Add this to your backend routes
app.${method}('${frontendRoute.url}', async (req, res) => {
    try {
        // TODO: Implement ${frontendRoute.url} logic
        const result = {}; // Replace with actual implementation
        res.json(result);
    } catch (error) {
        console.error('Error in ${frontendRoute.url}:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});`;
    }

    // Generate auth header template
    generateAuthHeaderTemplate() {
        return `
// Add authentication headers to your API calls
const headers = {
    'Authorization': 'Bearer ' + getAuthToken(),
    'Content-Type': 'application/json'
};

// For fetch
fetch(url, { headers, ...options })

// For axios
axios.get(url, { headers })`;
    }

    // Get all files with specific extensions
    getAllFiles(dirPath, extensions) {
        let files = [];
        
        if (!fs.existsSync(dirPath)) {
            console.warn(`⚠️  Directory not found: ${dirPath}`);
            return files;
        }
        
        const items = fs.readdirSync(dirPath);
        
        items.forEach(item => {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                files = files.concat(this.getAllFiles(fullPath, extensions));
            } else if (stat.isFile()) {
                const ext = path.extname(item);
                if (extensions.includes(ext)) {
                    files.push(fullPath);
                }
            }
        });
        
        return files;
    }

    // Generate comprehensive report
    generateReport() {
        this.report = {
            timestamp: new Date().toISOString(),
            summary: {
                backendEndpoints: this.endpoints.length,
                frontendApiCalls: this.frontendRoutes.length,
                totalIssues: this.issues.length,
                criticalIssues: this.issues.filter(i => i.severity === 'HIGH').length,
                warningIssues: this.issues.filter(i => i.severity === 'MEDIUM').length,
                infoIssues: this.issues.filter(i => i.severity === 'LOW').length
            },
            endpoints: this.endpoints,
            frontendRoutes: this.frontendRoutes,
            issues: this.issues,
            fixes: this.generateAlignmentFixes(),
            recommendations: this.generateRecommendations()
        };
        
        fs.writeFileSync(this.config.outputFile, JSON.stringify(this.report, null, 2));
        console.log(`📄 Report saved to: ${this.config.outputFile}`);
    }

    // Generate recommendations
    generateRecommendations() {
        return [
            'Implement error handling for all API calls',
            'Add proper authentication middleware',
            'Set up API documentation (OpenAPI/Swagger)',
            'Implement request/response logging',
            'Add input validation for all endpoints',
            'Set up health check endpoints',
            'Implement rate limiting',
            'Add CORS configuration',
            'Set up proper error responses',
            'Consider API versioning strategy'
        ];
    }

    // Run the complete alignment process
    async run() {
        console.log('🚀 Starting Frontend-Backend Alignment Process...\n');
        
        try {
            await this.discoverBackendEndpoints();
            console.log('');
            
            this.scanFrontendApiCalls();
            console.log('');
            
            this.findAlignmentIssues();
            console.log('');
            
            this.generateReport();
            console.log('');
            
            this.printSummary();
            
        } catch (error) {
            console.error('❌ Error during alignment process:', error.message);
        }
    }

    // Print summary
    printSummary() {
        console.log('📊 ALIGNMENT SUMMARY');
        console.log('===================');
        console.log(`Backend Endpoints: ${this.report.summary.backendEndpoints}`);
        console.log(`Frontend API Calls: ${this.report.summary.frontendApiCalls}`);
        console.log(`Total Issues: ${this.report.summary.totalIssues}`);
        console.log(`  - Critical: ${this.report.summary.criticalIssues}`);
        console.log(`  - Warnings: ${this.report.summary.warningIssues}`);
        console.log(`  - Info: ${this.report.summary.infoIssues}`);
        
        if (this.report.summary.criticalIssues > 0) {
            console.log('\n🚨 CRITICAL ISSUES FOUND:');
            this.issues.filter(i => i.severity === 'HIGH').forEach(issue => {
                console.log(`  - ${issue.message}`);
            });
        }
        
        console.log(`\n📄 Full report available in: ${this.config.outputFile}`);
    }
}

// CLI Usage
if (require.main === module) {
    const config = {
        backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
        frontendPath: process.env.FRONTEND_PATH || './frontend',
        backendPath: process.env.BACKEND_PATH || './backend',
        outputFile: process.env.OUTPUT_FILE || 'alignment-report.json'
    };
    
    const aligner = new FrontendBackendAligner(config);
    aligner.run();
}

module.exports = FrontendBackendAligner;
