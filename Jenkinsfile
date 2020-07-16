@Library(value="kids-first/aws-infra-jenkins-shared-libraries", changelog=false) _
ecs_service_type_1_standard {
    projectName = "kf-api-persona"
    environments = "dev,qa,prd"
    docker_image_type = "alpine"
    entrypoint_command = "yarn start" 
    deploy_scripts_version = "master"
    quick_deploy = "true"
    external_config_repo = "false"
    container_port = "3232"
    vcpu_container             = "2048"
    memory_container           = "4096"
    vcpu_task                  = "2048"
    memory_task                = "4096"
    health_check_path = "/status"
    dependencies = "ecr"
    friendly_dns_name = "persona"
}
