job "checkboxio_nomad" {
  datacenters = [ "dc1" ]
  group "default" {
    count = 1
    task "count" {
      driver = "raw_exec"
      resources {
        memory = 512
      }
      config {
        command = "/etc/git/run_job.sh"
      }
    }
  }
}
