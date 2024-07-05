# Deploy a Node.js App on Kubernetes and Minikube with Ubuntu

## Install docker

1. Run the commands:
```bash
sudo apt update
sudo apt upgrade
sudo apt-get install -y apt-utils
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```
2. Log Out and Log Back In:
- Apply the changes to your user group by logging out and logging back in.
3. Check Docker Version:
```bash
docker –version
```
4. Check Docker Service Status:
```bash
sudo systemctl status docker
```
5. Start Docker Service (if needed):
```bash
sudo systemctl start docker
```
6. Enable Docker Service to Start on Boot:
```bash
sudo systemctl enable docker
```
7. Run a Test Container:
```bash
sudo docker run hello-world
```

## Install kubectl

1. Download the latest release of kubectl:
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```
2. Make the kubectl binary executable:
```bash
chmod +x kubectl
```
3. Move the binary in to your PATH:
```bash
sudo mv kubectl /usr/local/bin/
```
4. Test to ensure the version you installed is up-to-date:
```bash
kubectl version –client
```

## Install minikube

1. Download the latest release of minikube:
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
```
2. Install minikube:
```bash
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```
3. Verify minikube Installation:
```bash
minikube start --driver=docker
```
4. Start minikube:
```bash
minikube start --driver=docker
```
5. Verify minikube image:
```bash
docker images
```

## Verify the Installations

1. docker:
```bash
docker –version
```
2. kubectl:
```bash
kubectl version --client
```
3. minikube:
```bash
minikube version
```
4. Check if kubectl can connect to your minikube cluster:
```bash
kubectl get nodes
```
- This should output details about your minikube node, indicating that both kubectl and minikube are installed and working correctly.

## Troubleshooting Tips

- Permissions: Ensure you run the commands with appropriate permissions (sudo where necessary).
- Dependencies: Make sure you have the required dependencies installed, such as curl and virtualbox for minikube (if you are using VirtualBox as the driver).
- Environment Variables: If kubectl or minikube commands are not found, make sure /usr/local/bin is in your PATH.

## Deploy the app on Kubernetes

1. Clone the app on the Ubuntu:
```bash
git clone https://github.com/awsaf-utm/Deploy-a-Node.js-App-on-Kubernetes-and-Minikube-with-Ubuntu.git
```
2. Go to the app folder:
```bash
cd Deploy-a-Node.js-App-on-Kubernetes-and-Minikube-with-Ubuntu
```
3. Create the Docker image of the app to use in Pods via Image:
```bash
docker build -t my-node-app-image .
```
4. Create the **Pod** of the app (do not require as Deployment will create Pods as per deployment.yaml specifications):
	1. Create Pod:
	```bash
	kubectl apply -f pod.yaml
	```
	2. To check Pods and get Pod IP:
	```bash
	kubectl get pods o wide
	```
	3. To test the Pod, go to the minikube:
	```bash
	minikube ssh
	```
	4. Run the curl command to execute the app inside the Pod:
	```bash
	curl 10.244.0.11:3001 #curl PodIP: containerPort-in-pod.yaml
	```

5.	Create the **Deployment** of the app to use in Service to link via Selector:
	1. Create Deployment:
	```bash
	kubectl apply -f deployment.yaml
	```
	2. To check Deployment:
	```bash
	kubectl get deploy -o wide
	```
	3. To get Pod IP:
	```bash
	kubectl get pods o wide
	```
	4. To test the Pod, go to the minikube:
	```bash
	minikube ssh
	```
	5. Run the curl command to execute the app inside the Pod:
	```bash
	curl 10.244.0.11:3001 #curl PodIP: containerPort-in-deployment.yaml
	```

6.	Create the **Service (NodePort)** of the app with the Deployment:
	1. Create NodePort Service:
	```bash
	kubectl apply -f service-nodeport.yaml
	```
	2. To check Services:
	```bash
	kubectl get service -o wide
	```
	3. To get Minikube IP:
	```bash
	minikube ip
	# or, 
	minikube service my-node-app-service-nodeport url
	```
	4. Run the curl command to execute the app:
	```bash
	curl http://192.168.49.2:30001 #curl http:// minikube-IP:nodePort-in-service.yaml-file
	```
7.	Create the **Service (LoadBalancer)** of the app with the Deployment:
	1. Create LoadBalancer Service:
	```bash
	kubectl apply -f service-loadbalancer.yaml
	```
	2. To check Services:
	```bash
	kubectl get service -o wide
	```
	3. To get Minikube IP:
	```bash
	minikube ip
	# or, 
	minikube service my-node-app-service-loadbalancer url
	```
	4. Run the curl command to execute the app:
	```bash
	curl http://192.168.49.2:30001 #curl http:// minikube-IP:nodePort-in-service.yaml-file
	```

8.	Create the **Ingress Resource** with the Service:
	1. Create Ingress Resource:
	```bash
	kubectl apply -f ingress-nginx.yaml
	```
	2. To check Services:
	```bash
	kubectl get ingresses -o wide
	```
	3. Enable Ingress Controller:
	```bash
	minikube addons enable ingress
	```
	4. Verify Ingress Controller:
	```bash
	kubectl get deployments -n ingress-nginx #In Deployments
	kubectl get pods -A | grep nginx #In Pods
	```
	5. To get the IP and Port:
	```bash
	kubectl get ingresses -o wide 
	```
	6. Add Minikube IP in the hosts file:
	```bash
	sudo vim /etc/hosts #192.168.49.2 myapp.com
	```
	7. Run the curl command to execute the app:
	```bash
	curl http://myapp.com #myapp.com is got from ingress-nginx.yaml file
	```

