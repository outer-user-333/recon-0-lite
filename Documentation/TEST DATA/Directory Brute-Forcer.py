import requests
import sys

def directory_bruteforcer(target_url, wordlist_file):
    """
    Attempts to find hidden directories on a target website.

    Args:
        target_url (str): The URL of the target website.
        wordlist_file (str): The path to the wordlist file.
    """
    print(f"[*] Starting directory brute-force on {target_url}...")
    
    try:
        with open(wordlist_file, "r") as f:
            wordlist = f.read().splitlines()
    except FileNotFoundError:
        print(f"[-] Wordlist file not found: {wordlist_file}")
        return

    for directory in wordlist:
        full_url = f"{target_url}/{directory}"
        try:
            response = requests.get(full_url)
            # A 200 OK status code indicates a successful request
            if response.status_code == 200:
                print(f"[+] Found directory: {full_url}")
        except requests.exceptions.RequestException as e:
            # Handle connection errors
            print(f"[-] An error occurred: {e}")
            break

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python dir_bruteforcer.py <target_url> <wordlist_file>")
        sys.exit(1)

    target = sys.argv[1]
    wordlist = sys.argv[2]
    directory_bruteforcer(target, wordlist)
