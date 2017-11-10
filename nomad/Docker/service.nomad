job "NodeJS_Counter" {
  datacenters = [ "dc1" ]
  group "default" {
    count = 1
    task "count" {
      driver = "docker"
      config {
        image = "iankurgarg/devops-checkbox:latest"
	port_map = {
	  http = 80
	}
        command = "./runscript.sh"
      }
	resources {
         memory = 512
         network {
          port "http" {}
	  port "https" {}
         }
        }
    }
  }
}
