{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs
  ];

  shellHook = ''
    echo "Premier-Metrics development shell loaded"
    echo "Node version: $(node --version)"
    echo "npm version: $(npm --version)"
  '';
}
