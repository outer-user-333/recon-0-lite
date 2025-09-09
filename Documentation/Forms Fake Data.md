# Admin Account

id: "user-admin",
        email: "admin@recon0.com",
        password: "pass123",
        username: "PlatformAdmin",
        full_name: "Admin User",
        role: "admin",
         status: 'Active', // <-- ADD THIS
        reputation_points: 0,
        avatar_url: null,
        bio: "Platform Administrator",
        created_at: new Date().toISOString(),



# Hacker Accounts (5)

Full Name: Alex "Specter" Riley

Username: specter\_hax

Email: alex.riley@protonmail.com

Password: Password123!

Sign up as: Hacker



Full Name: Jane "ByteNinja" Chen

Username: byteninja

Email: jane.c@tutanota.com

Password: SecretPassword!

Sign up as: Hacker



Full Name: Omar "CodeBreaker" Hassan

Username: codebreaker

Email: omar.hassan@mail.com

Password: MyStrongPassword!

Sign up as: Hacker



Full Name: Lily "Glitch" Evans

Username: glitch\_hax

Email: lily.evans@privatemail.net

Password: TestPassword!

Sign up as: Hacker



Full Name: Mike "Cipher" Lee

Username: cipher\_sec

Email: mike.lee@secure.org

Password: SecurePassword!

Sign up as: Hacker



# Organization Accounts (5)

Full Name: SecureTech Solutions

Username: SecureTech\_Solutions

Email: contact@securetech.com

Password: OrgPassword123!

Sign up as: Organization



Full Name: Global Cyber Corp

Username: GlobalCyberCorp

Email: security@globalcybercorp.com

Password: CorporationSecure!

Sign up as: Organization



Full Name: FinGuard Inc.

Username: FinGuard\_Inc

Email: info@finguard.net

Password: FinGuardSecure!

Sign up as: Organization



Full Name: InnovateTech

Username: InnovateTech\_Sec

Email: support@innovatetech.io

Password: InnovatePass!

Sign up as: Organization



Full Name: DataFortress LLC

Username: DataFortress\_LLC

Email: security@datafortress.com

Password: FortressSecure!

Sign up as: Organization




# Hacker Profiles (5)
===

Email: specter.riley@protonmail.com

Full Name: Alex "Specter" Riley

Username: specter\_hax

Bio: Cybersecurity enthusiast and bug bounty hunter specializing in network security and vulnerability analysis.



Email: jane.c@tutanota.com

Full Name: Jane "ByteNinja" Chen

Username: byteninja

Bio: Passionate about web application security and building secure systems. Always looking for new challenges.



Email: omar.hassan@mail.com

Full Name: Omar "CodeBreaker" Hassan

Username: codebreaker

Bio: Ethical hacker with a focus on cloud security and penetration testing.



Email: lily.evans@privatemail.net

Full Name: Lily "Glitch" Evans

Username: glitch\_hax

Bio: Security researcher and full-stack developer. I break things to make them stronger.



Email: mike.lee@secure.org

Full Name: Mike "Cipher" Lee

Username: cipher\_sec

Bio: Cryptography and data protection specialist. Dedicated to securing digital assets.







# Organization Profiles (5)

Email: contact@securetech.com

Full Name: SecureTech Solutions

Username: SecureTech\_Solutions

Bio: A leading cybersecurity firm dedicated to providing cutting-edge security solutions for businesses worldwide.



Email: security@globalcybercorp.com

Full Name: Global Cyber Corp

Username: GlobalCyberCorp

Bio: We build and protect critical infrastructure with a team of world-class security experts.



Email: info@finguard.net

Full Name: FinGuard Inc.

Username: FinGuard\_Inc

Bio: Protecting financial institutions with robust security protocols and a commitment to digital safety.



Email: support@innovatetech.io

Full Name: InnovateTech

Username: InnovateTech\_Sec

Bio: We develop secure, scalable, and innovative software solutions for the modern digital landscape.



Email: security@datafortress.com

Full Name: DataFortress LLC

Username: DataFortress\_LLC

Bio: Your data is our mission. We provide comprehensive data security and privacy solutions












# Create New Program Data

Program 1: "FinSecure" Core Banking API Bounty
Program Title: "FinSecure" Core Banking API Bounty

Description:
We are inviting the security research community to help us secure our next-generation core banking API, which is the backbone of our new mobile banking application. This API handles critical operations including user authentication, balance inquiries, fund transfers, transaction history retrieval, and integration with third-party financial services. We are particularly interested in identifying vulnerabilities that could lead to financial fraud, data breaches, or unauthorized account access. The API is built on a RESTful architecture using OAuth 2.0 for authorization. We are looking for logical flaws, injection vulnerabilities, and weaknesses in the cryptographic implementation.

Policy:
Researchers must adhere to a strict code of conduct. Any form of Denial of Service (DoS or DDoS) is strictly prohibited. Do not engage in social engineering of our staff or customers. Do not attempt to access or modify data belonging to other users. All testing must be performed on accounts you have created yourself. Any finding that involves Personally Identifiable Information (PII) must be reported immediately, and you must not save a copy of this data. Public disclosure of vulnerabilities is only permitted after we have confirmed a patch and have given our explicit written consent.

Scope:

1. https://api.finsecure-staging.com/v2/*
2. https://auth.finsecure-staging.com/oauth/token
3. Our official Android application (com.finsecure.mobile.staging, v2.1.5)

Out of Scope:

1. https://www.finsecure.com (main corporate website)
2. https://blog.finsecure.com
3. Any third-party services that we integrate with.
4. Our corporate IT infrastructure and employee email systems.

Min Bounty: $2,000
Max Bounty: $50,000
Tags: api, banking, finance, sensitive-data-exposure, broken-access-control, mobile, android, oauth

=== 
Program 2: "ShopSphere" E-commerce & Vendor Platform Bounty
Program Title: "ShopSphere" E-commerce & Vendor Platform Bounty

Description:
Help us protect the integrity of the ShopSphere multi-vendor e-commerce platform. This program covers our customer-facing storefront, the vendor management dashboard, and our internal payment processing gateway API. We are looking for a wide range of vulnerabilities, including but not limited to: Cross-Site Scripting (XSS) on product pages, SQL Injection in search fields, Cross-Site Request Forgery (CSRF) on vendor actions, and privilege escalation from a customer account to a vendor account. We are especially interested in vulnerabilities that could allow for payment bypass or manipulation of product prices and inventory.

Policy:
Please use your own accounts for testing. Do not use automated scanners that generate a high volume of traffic. Do not attempt to phish other users or vendors. When testing payment systems, please use the provided test credit card numbers and do not process real transactions. Any finding must be reported exclusively through this platform. Violation of this policy will result in ineligibility for bounties and potential legal action.

Scope:

1. https://*.shopsphere.io (All subdomains are in scope unless explicitly excluded)
2. https://api.payment.shopsphere-internal.net/v1/

Out of Scope:

1. https://status.shopsphere.io
2. Third-party logistics provider portals.
3. Our content delivery network (CDN) provider.

Min Bounty: $250
Max Bounty: $15,000
Tags: web, e-commerce, payment, xss, csrf, sqli, privilege-escalation, marketplace

===

Program 3: "HealthGuard" Patient Portal & Mobile App Security Program
Program Title: "HealthGuard" Patient Portal & Mobile App Security Program

Description:
At HealthGuard, patient data privacy is our utmost priority. We are running this bounty program to identify potential security vulnerabilities in our patient portal and the associated iOS/Android mobile applications. These platforms handle sensitive Protected Health Information (PHI). We are critically interested in flaws such as Insecure Direct Object References (IDOR) allowing access to other patients' records, HIPAA violations, weak encryption, and any vulnerability that could compromise the confidentiality and integrity of patient data.

Policy:
Under no circumstances should you attempt to access, view, or modify real patient data that does not belong to you. All testing must be conducted using test accounts that you create. Any accidental discovery of another user's PHI must be reported to our security team immediately, and all local copies must be securely deleted. This program is subject to legal terms that align with HIPAA guidelines. Researchers are expected to act in good faith to protect data.

Scope:

1. https://portal.healthguard.med
2. https://api.mobile.healthguard.med
3. HealthGuard iOS App (latest version from App Store)
4. HealthGuard Android App (latest version from Play Store)

Out of Scope:

1. https://www.healthguard.med (public marketing site)
2. Physical security of our data centers and offices.
3. Third-party healthcare providers integrated into our system.

Min Bounty: $1,000
Max Bounty: $25,000
Tags: web, mobile, api, healthcare, hipaa, idor, phi, sensitive-data-exposure, encryption

Program 4: "ConnectSphere IoT" Cloud Platform & Device API Bounty
Program Title: "ConnectSphere IoT" Cloud Platform & Device API Bounty

Description:
ConnectSphere provides a robust cloud platform for managing millions of IoT devices worldwide. We are looking for security vulnerabilities in our cloud management dashboard, the device-to-cloud communication API (using MQTT over TLS), and our firmware Over-the-Air (OTA) update mechanism. We are highly concerned about vulnerabilities that could lead to device hijacking, large-scale device outages, data spoofing from compromised devices, or unauthorized access to device control functions.

Policy:
Do not target physical IoT devices that you do not own. For research purposes, you can register virtual devices against our staging environment. Do not perform any actions that could disrupt the service for our customers. Any discovered vulnerability must not be used to pivot into our internal cloud infrastructure. We expect detailed reports with clear, reproducible steps.

Scope:

1. https://dashboard.connectsphere.cloud
2. mqtts://*.broker.connectsphere.cloud
3. https://api.ota.connectsphere.cloud

Out of Scope:
1. The hardware or firmware of specific IoT devices made by our partners.
2. The underlying cloud infrastructure (e.g., AWS, Azure vulnerabilities).
3. Cellular or satellite network providers used for device connectivity.

Min Bounty: $750
Max Bounty: $18,000
Tags: iot, cloud, api, mqtt, firmware, broken-access-control, device-security, ota

Program 5: "VibeNet" Social Media App Vulnerability Program
Program Title: "VibeNet" Social Media App Vulnerability Program

Description:
VibeNet is a fast-growing social media platform, and the safety of our users is paramount. We invite security researchers to find and report vulnerabilities in our Android and iOS mobile applications and the backend API that powers them. We are primarily focused on identifying issues that could lead to account takeover (ATO), privacy violations (e.g., accessing private posts or messages), insecure data storage on the device, and manipulation of our platform's social features (e.g., generating fake likes or follows).

Policy:
All testing must be performed on accounts that you own. Do not interact with, target, or attempt to access data from other users' accounts. Do not post spam, malicious, or inappropriate content on the platform. Public disclosure is only allowed 90 days after we have acknowledged your report and confirmed a fix has been deployed.

Scope:
1. VibeNet for Android (latest version available on Google Play)
2. VibeNet for iOS (latest version available on the App Store)
3. https://api.vibenet.social/v3/*

Out of Scope:
1. https://web.vibenet.social (Our legacy web client is out of scope)
2. Our corporate websites and internal employee systems.
3. Third-party ad networks integrated into the apps.

Min Bounty: $300
Max Bounty: $12,000
Tags: mobile, android, ios, api, privacy, account-takeover, insecure-storage, social-media



# Submit Report Data

===


Report 1: IDOR in Transaction History API
Title: Insecure Direct Object Reference (IDOR) Allows Access to Any User's Transaction History

Severity: Critical

Vulnerability Description: The /api/v2/users/{userId}/transactions endpoint is vulnerable to an Insecure Direct Object Reference (IDOR). An authenticated user can replace their own userId in the API call with the userId of another user and retrieve that user's complete transaction history. The endpoint fails to validate if the requesting user is authorized to view the requested data.

Steps to Reproduce:

1. Log in as User A with userId=12345.
2. Using a proxy like Burp Suite, capture the request made to fetch the transaction history. The request will look like: GET /api/v2/users/12345/transactions.
3. Modify the request by changing the userId to that of another user (e.g., userId=67890). The new request is GET /api/v2/users/67890/transactions.
4. Forward the modified request. The API responds with the full transaction history for User B (userId=67890).

Impact: This vulnerability leaks highly sensitive financial data, including transaction amounts, dates, and counterparties, leading to a massive privacy breach. An attacker could use this information for fraud, social engineering, or to publicly expose user data.

Report 2: SQL Injection on Vendor Dashboard Search
Title: Blind Boolean-Based SQL Injection in Vendor Product Search

Severity: High

Vulnerability Description: The product search functionality in the vendor dashboard at https://*.shopsphere.io/vendor/products is vulnerable to a time-based blind SQL injection. The searchQuery parameter is not properly sanitized before being included in a database query, allowing an attacker to inject malicious SQL commands.

Steps to Reproduce:

1. Navigate to the vendor dashboard's product page.
2. In the search bar, enter the following payload: ' OR (SELECT 1 FROM (SELECT(SLEEP(10)))a)--
3. Observe that the server response is delayed by 10 seconds, confirming the SQL injection vulnerability.
4. An attacker can now use tools like sqlmap to automate the extraction of database contents.

Impact: A successful exploit could allow an attacker to dump the entire database, including customer PII, vendor information, order details, and potentially payment information.

Report 3: Broken Function Level Authorization in Patient Appointment Cancellation
Title: Broken Function Level Authorization Allowing Cancellation of Any Patient's Appointment

Severity: High

Vulnerability Description: The API endpoint for cancelling appointments (POST /api/mobile/appointments/cancel) lacks proper authorization checks. Any authenticated user can cancel an appointment belonging to another user by simply knowing the appointmentId.

Steps to Reproduce:

1. Log in as a patient (Attacker) and book an appointment to get a valid appointmentId, e.g., APP-112233.
2. Log in as another patient (Victim) and note their appointmentId, e.g., APP-445566.
3. As the Attacker, send a POST request to /api/mobile/appointments/cancel with the Victim's appointmentId in the body: {"appointmentId": "APP-445566"}.
4. The API processes the request successfully and cancels the Victim's appointment without verifying that the Attacker is the owner of that appointment.

Impact: This flaw could cause significant disruption to patient care, leading to missed appointments for critical medical procedures. It represents a serious integrity issue and could have real-world health consequences for patients.

Report 4: Privilege Escalation via API Parameter Tampering
Title: Privilege Escalation from User to Administrator via isAdmin Parameter

Severity: Critical

Vulnerability Description: The user profile update endpoint (PUT /api/vibenet.social/v3/profile) improperly processes a user-supplied isAdmin parameter. By adding isAdmin: true to the JSON body of the request, a regular user can escalate their privileges to an administrator, gaining access to administrative functions.

Steps to Reproduce:

1. Log in as a standard user.
2. Capture the request to update the user's profile (e.g., changing their bio).
3. The original JSON body might be: {"bio": "This is my new bio."}
4. Modify the JSON body to include the isAdmin parameter: {"bio": "This is my new bio.", "isAdmin": true}
5. Send the modified request. The server accepts the parameter and flags the user account as an administrator.

Impact: An attacker can gain full administrative control over the platform, allowing them to view, modify, or delete any user's data, post content globally, and manage the entire application.

Report 5: Unauthenticated Access to IoT Device Data via MQTT Wildcard
Title: Sensitive IoT Data Exposure via Unauthenticated MQTT Topic Subscription

Severity: High

Vulnerability Description: The MQTT broker at mqtts://*.broker.connectsphere.cloud allows unauthenticated clients to connect and subscribe to topics using wildcards. An attacker can subscribe to devices/+/data and receive real-time data from all connected IoT devices on the platform.

Steps to Reproduce:
1. Use a standard MQTT client (e.g., MQTT.fx or mosquitto).
2. Connect to the public-facing MQTT broker endpoint without providing any credentials.
3. Subscribe to the wildcard topic: devices/+/data.
4. The client immediately starts receiving data streams from all devices publishing to their respective data topics.

Impact: This allows for a large-scale breach of sensitive data being transmitted by IoT devices, which could include location data, sensor readings, and other confidential information, depending on the device's function.

Report 6: Server-Side Request Forgery (SSRF) in Profile Image Upload
Title: SSRF Vulnerability in "Upload from URL" Feature

Severity: High

Vulnerability Description: The feature allowing users to upload a profile picture from a URL is vulnerable to Server-Side Request Forgery (SSRF). The server fetches the image from the provided URL without validating whether the URL points to an internal resource.

Steps to Reproduce:

1. Go to the user profile settings and choose the "Upload from URL" option.
2. Instead of a public image URL, provide an internal IP address or metadata endpoint, for example: http://169.254.169.254/latest/meta-data/.
3. Submit the URL.
4. The server-side error message or the resulting "image" will contain the response from the internal service, confirming the SSRF.

Impact: An attacker can use this vulnerability to scan the internal network, access internal services, and potentially retrieve sensitive cloud provider metadata, including access keys and other credentials.

Report 7: Cross-Site Request Forgery (CSRF) on Account Deletion
Title: CSRF on Account Deletion Functionality

Severity: Medium

Vulnerability Description: The account deletion functionality lacks anti-CSRF token protection. An attacker can craft a malicious webpage that, when visited by a logged-in victim, will trigger a request to delete their account without their consent.

Steps to Reproduce:

1. Create a simple HTML page with a form that auto-submits on load.

<html>
  <body>
    <form id="csrf-form" action="[https://api.vibenet.social/v3/account/delete](https://api.vibenet.social/v3/account/delete)" method="POST">
    </form>
    <script>document.getElementById('csrf-form').submit();</script>
  </body>
</html>

2. Host this page on a server controlled by the attacker.
3. Trick a logged-in user into visiting the page.
4. The form will be submitted with the user's session cookie, and their account will be permanently deleted.

Impact: This can lead to permanent loss of user data and denial of service for the victim user.

Report 8: Missing Rate Limiting on Login Endpoint
Title: No Rate Limiting on Login Page Leading to Brute-Force Attacks

Severity: Medium

Vulnerability Description: The login endpoint (https://auth.finsecure-staging.com/oauth/token) does not implement any rate limiting or account lockout mechanism. This allows an attacker to perform unlimited login attempts, making user accounts vulnerable to password brute-forcing or credential stuffing attacks.

Steps to Reproduce:

1. Identify a valid username (e.g., user@example.com).
2. Use a tool like Hydra or a custom script to send thousands of login requests with a password list to the login endpoint.
3. Observe that the server responds to every request without blocking the IP or locking the account.
4. Given enough time and a common password list, the attacker can successfully guess the user's password.

Impact: This can lead to widespread account takeovers, especially for users with weak or re-used passwords.

Report 9: Hardcoded API Key in Android Application
Title: Hardcoded Third-Party API Key in Android App

Severity: Medium

Vulnerability Description: The HealthGuard Android application (APK) contains a hardcoded API key for a third-party mapping service. This key is stored in plain text within the strings.xml file.

Steps to Reproduce:

1. Download the HealthGuard APK file.
2. Decompile the APK using apktool or a similar tool.
3. Search the decompiled files for common API key patterns or strings.
4. The key is found in res/values/strings.xml under the name Maps_api_key.

Impact: An attacker can extract this key and use it in their own applications, potentially leading to financial costs for HealthGuard due to fraudulent API usage. It could also be used to abuse the third-party service under the guise of the HealthGuard application.

Report 10: Stored XSS in Product Review Section
Title: Stored Cross-Site Scripting (XSS) in Product Reviews

Severity: High

Vulnerability Description: The product review submission form on shopsphere.io does not adequately sanitize user input. An attacker can submit a review containing a malicious JavaScript payload. This script is then stored on the server and executes in the browser of any user who views the product page.

Steps to Reproduce:

1. Navigate to any product page on https://www.shopsphere.io/product/123.
2. Submit a product review. In the review text field, insert the payload: <img src=x onerror=alert(document.cookie)>.
3. The review is accepted and saved.
4. Now, any user (including administrators) who navigates to that product page will see an alert box displaying their cookies.

Impact: An attacker can steal user session cookies, perform actions on behalf of logged-in users (like changing their address or placing orders), or deface the website.
