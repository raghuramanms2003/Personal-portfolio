 async function fetchGitHubProjects(username) {
     try {
         const response = await fetch(`https://api.github.com/users/${username}/repos`);
         const repos = await response.json();
         
         const projectsContainer = document.getElementById('github-projects');
         
         const topRepos = repos
             .sort((a, b) => b.stargazers_count - a.stargazers_count)
             .slice(0, 6);
         
         topRepos.forEach(repo => {
             const projectCard = `
                 <a href="${repo.html_url}" target="_blank" 
                    class="card p-6 rounded-lg transition-all duration-300 hover:scale-[1.02]">
                     <h4 class="font-medium mb-2 text-sky-400">${repo.name}</h4>
                     <p class="text-sm text-gray-400 mb-4">${repo.description || 'No description'}</p>
                     <div class="flex items-center justify-between text-xs text-gray-400">
                         <div class="flex space-x-4">
                             <span>⭐ ${repo.stargazers_count}</span>
                             <span>🍴 ${repo.forks_count}</span>
                         </div>
                         <span>${repo.language || 'Various'}</span>
                     </div>
                 </a>
             `;
             projectsContainer.innerHTML += projectCard;
         });
     } catch (error) {
         console.error('Error fetching GitHub data:', error);
     }
 }

 // Fetch GitHub projects
 fetchGitHubProjects('umutxyp'); //your github name
