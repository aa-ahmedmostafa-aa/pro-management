# Steps to generate RSA key pair to sign & verify JWT Token in the authenticator:

1. Make sure that there is a folder with name Keys in the root directory of the application e.g. **files/keys/**
2. Make sure that the property with name **TOKEN_KEYS_PATH** in the .env.local file is configured to the keys folder.
3. Run this command in the terminal to generate the private key in **.pem** format
    ```
    openssl genrsa -out private.pem 2048
    ```
4. Run this command in the terminal to generate the public key from the generated private key in **.pem** format
    ```
    openssl rsa -in private.pem -outform PEM -pubout -out public.pem
    ```
6. Move both files **private.pem** & **public.pem** to the **files/keys** folder
7. Make sure that the properties **TOKEN_PRIVATE_KEY_NAME** & **TOKEN_PUBLIC_KEY_NAME** in the **.env.local** file are configured to the name for the two newly generated keys.

# Steps to add the verification key in the project backend:
1. Make sure that there is a folder with name Keys in the root directory of the application e.g. **files/keys/**
2. Make sure that the property with name **TOKEN_KEYS_PATH** in the **.env.local** file is configured to the keys folder.
3. Copy the public key generated into the keys folder **files/keys**
4. Make sure that the property **TOKEN_PUBLIC_KEY_NAME** in the **.env.local** file is configured with the name of the recently copied public key

> N.B. the name that will be added for the public and private keys must
> contain the extension i.e. .pem and the both the private and public
> keys must be in pem formats
