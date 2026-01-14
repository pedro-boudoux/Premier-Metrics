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
  ];

  shellHook = ''
    echo "Premier-Metrics development shell loaded"
    echo "Node version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo "Python version: $(python --version)"
  '';
}
