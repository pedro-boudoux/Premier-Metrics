{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs
    python313
    python313Packages.pip
    python313Packages.requests
    python313Packages.beautifulsoup4
    python313Packages.pandas
    python313Packages.psycopg2
    python313Packages.python-dotenv
    python313Packages.nbformat
    python313Packages.nbconvert
    python313Packages.lxml
    # For curl_cffi build
    curl
    openssl
    gcc
    stdenv.cc.cc.lib
  ];

  shellHook = ''
    echo "Premier-Metrics development shell loaded"
    echo "Node version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo "Python version: $(python --version)"
    
    # Add libstdc++ to library path for curl_cffi
    export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH"
    
    # Create venv if it doesn't exist
    if [ ! -d .venv ]; then
      python -m venv .venv
      source .venv/bin/activate
      pip install curl_cffi
    else
      source .venv/bin/activate
    fi
  '';
}
