{ pkgs }: {
  deps = [
    pkgs.openmolcas
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
  ];
}