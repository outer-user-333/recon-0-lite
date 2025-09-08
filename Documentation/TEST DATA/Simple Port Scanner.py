import socket
import sys
import argparse

def port_scanner(target, ports):
    """
    Scans a target host for open ports.

    Args:
        target (str): The target IP address or hostname.
        ports (list): A list of ports to scan.
    """
    print(f"[*] Scanning {target} for open ports...")
    
    for port in ports:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        
        # Connect to the target on the specified port
        result = sock.connect_ex((target, port))
        
        if result == 0:
            print(f"[*] Port {port}: OPEN")
        else:
            print(f"[*] Port {port}: CLOSED")
            
        sock.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="A simple port scanner.")
    parser.add_argument("target", help="The target IP address or hostname.")
    parser.add_argument("-p", "--ports", help="Ports to scan (comma-separated).", default="80,443,22,21,25")
    
    args = parser.parse_args()
    
    try:
        target_ip = socket.gethostbyname(args.target)
    except socket.gaierror:
        print("[-] Invalid target. Please provide a valid IP or hostname.")
        sys.exit(1)
        
    port_list = [int(p) for p in args.ports.split(',')]
    port_scanner(target_ip, port_list)
