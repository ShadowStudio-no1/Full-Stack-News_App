from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.request
import json
from urllib.parse import urlparse, parse_qs

class NewsProxyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/news/'):
            try:
                # Parse the URL and query parameters
                parsed_url = urlparse(self.path)
                query_params = parse_qs(parsed_url.query)
                
                # Extract the endpoint and API key
                endpoint = self.path.replace('/api/news/', '')
                api_key = query_params.get('apiKey', [''])[0]
                
                # Construct the NewsAPI URL
                newsapi_url = f'https://newsapi.org/v2/{endpoint}'
                
                # Make the request to NewsAPI
                req = urllib.request.Request(
                    newsapi_url,
                    headers={
                        'Authorization': f'Bearer {api_key}',
                        'User-Agent': 'Mozilla/5.0'
                    }
                )
                
                with urllib.request.urlopen(req) as response:
                    data = response.read()
                    
                    # Send response headers
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    # Send the data
                    self.wfile.write(data)
                    
            except Exception as e:
                self.send_error(500, str(e))
        else:
            # Serve static files
            return SimpleHTTPRequestHandler.do_GET(self)

def run(server_class=HTTPServer, handler_class=NewsProxyHandler, port=3000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
