import requests
import sys

def xss_scanner(url):
    """
    Scans a URL for basic reflected XSS.

    Args:
        url (str): The URL to scan.
    """
    print(f"[*] Scanning {url} for reflected XSS...")
    
    # Test payload with an identifiable marker
    xss_payload = "<script>alert('XSS_TEST')</script>"
    
    try:
        # Inject the payload into the URL's query string
        if '?' in url:
            test_url = f"{url}&xss_test={xss_payload}"
        else:
            test_url = f"{url}?xss_test={xss_payload}"

        response = requests.get(test_url)

        # Check if the payload is reflected in the response body
        if xss_payload in response.text:
            print("[+] Reflected XSS vulnerability found!")
            print(f"[*] Test URL: {test_url}")
            print("[*] Payload was reflected in the page source.")
        else:
            print("[-] No reflected XSS vulnerability found.")

    except requests.exceptions.RequestException as e:
        print(f"[-] An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python xss_scanner.py <url>")
        sys.exit(1)
        
    target_url = sys.argv[1]
    xss_scanner(target_url)