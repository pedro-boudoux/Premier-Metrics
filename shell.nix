{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20
    pkgs.yarn
    pkgs.coreutils
  ];
  shellHook = ''
    cd client
    export PATH="$PWD/node_modules/.bin:$PATH"
  '';
}
