{ pkgs, ... }: {
  # Add the packages your project needs
  packages = [ 
    pkgs.nodejs_20,
    pkgs.python3,
    pkgs.nodePackages.peerflix
  ];

  # Configure your web preview
  idx.previews = {
    enable = true;
    previews = [
      {
        id = "web";
        command = ["npm", "run", "dev"];
        manager = "web";
      }
    ];
  };
}