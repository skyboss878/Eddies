// list-routes.js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// --- Configuration ---
// Path to your main router file. Adjust if yours is named differently.
const ROUTER_FILE_PATH = path.join(__dirname, 'src', 'App.jsx'); 
// -------------------

console.log(`🔍 Analyzing routes in: ${ROUTER_FILE_PATH}\n`);

const fileContent = fs.readFileSync(ROUTER_FILE_PATH, 'utf-8');

// Parse the file content into an Abstract Syntax Tree (AST)
const ast = parser.parse(fileContent, {
  sourceType: 'module',
  plugins: ['jsx'], // Enable JSX parsing
});

const routes = [];

/**
 * Normalizes a path segment by removing trailing '*' and ensuring it's not empty.
 * @param {string} segment
 * @returns {string}
 */
const normalizePathSegment = (segment) => segment?.replace(/\*$/, '') || '';

/**
 * Traverses the AST to find and build route paths.
 * @param {object} astNode - The current node in the AST.
 * @param {string[]} parentPaths - An array of path segments from parent routes.
 */
function findRoutes(astNode, parentPaths = []) {
  if (!astNode) return;

  // Check if the current node is a <Route> element
  const isRouteElement = astNode.type === 'JSXElement' && astNode.openingElement.name.name === 'Route';
  
  if (isRouteElement) {
    let currentPath = '';
    let isIndexRoute = false;
    
    // Find 'path' and 'index' props on the <Route> component
    astNode.openingElement.attributes.forEach(attr => {
      if (attr.type === 'JSXAttribute') {
        if (attr.name.name === 'path' && attr.value.type === 'StringLiteral') {
          currentPath = attr.value.value;
        }
        if (attr.name.name === 'index') {
          isIndexRoute = true;
        }
      }
    });

    const newParentPaths = [...parentPaths, normalizePathSegment(currentPath)];
    
    // An index route or a route with an 'element' prop is considered a final endpoint
    const hasElementProp = astNode.openingElement.attributes.some(
      attr => attr.type === 'JSXAttribute' && attr.name.name === 'element'
    );
    
    if (isIndexRoute || hasElementProp) {
        // Construct the full path
        let fullPath = newParentPaths.join('/');
        // Ensure the path starts with a slash and clean up any double slashes
        fullPath = ('/' + fullPath).replace(/\/+/g, '/').replace(/\/$/, '') || '/';
      
        if (isIndexRoute) {
             routes.push({ path: fullPath, type: 'Index Route' });
        } else {
             routes.push({ path: fullPath, type: 'Route' });
        }
    }
    
    // Recursively search for nested routes within the children
    astNode.children?.forEach(child => findRoutes(child, newParentPaths));
  } else {
    // If not a Route element, just continue searching its children
    astNode.children?.forEach(child => findRoutes(child, parentPaths));
  }
}

// Start the traversal from the root of the AST
traverse(ast, {
  JSXElement(path) {
    // We only want to start the top-level search inside the <Routes> component
    if (path.node.openingElement.name.name === 'Routes') {
      findRoutes(path.node);
      path.stop(); // Stop traversing once we've processed the Routes block
    }
  },
});


// --- Output the results ---
const publicRoutes = routes.filter(r => !r.path.startsWith('/app'));
const protectedRoutes = routes.filter(r => r.path.startsWith('/app'));

console.log('--- Public Routes ---');
if (publicRoutes.length > 0) {
    publicRoutes.forEach(r => console.log(r.path));
} else {
    console.log('No public routes found.');
}


console.log('\n--- Protected Routes ---');
if (protectedRoutes.length > 0) {
    protectedRoutes.forEach(r => console.log(r.path));
} else {
    console.log('No protected routes found.');
}

console.log(`\n✅ Found ${routes.length} total endpoints.`);
