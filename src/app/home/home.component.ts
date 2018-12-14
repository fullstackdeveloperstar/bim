import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { ProjectprofileService } from '../projectprofile/projectprofile.service';
import { DatabaseService } from '../_services/database.service';
import { AuthService } from '../_services/auth.service';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  projects = [];
  invitedProjects = [];
  currentUser = this.authService.getAuthUser();

  constructor(
    private router: Router,
    private projectService: ProjectprofileService,
    private databaseService: DatabaseService,
    private authService: AuthService
  ) { 
    if (this.currentUser) {
      this.databaseService.getRowDetails('/users', this.currentUser.uid).valueChanges().subscribe(data => {
        this.currentUser = data;
      });
    }
  }

  ngOnInit() {

    // Decide the project count by membership
    var maxCount = 5;
    if (this.currentUser && this.currentUser.membership) {
      maxCount = this.currentUser.membership.type;
    }

    this.projectService.getProjectsList().snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() })).filter(proj => proj.created_by == this.currentUser.uid)
      )
    ).subscribe(data => {
      if(data) {
        
        // Check the count of the projects
        if (data.length > maxCount) {
          var projects = [];

          data.forEach(item => {
            
            if (projects.length < maxCount) {
              projects.push(item);
            }

          });

          this.projects = projects;

        } else {

          this.projects = data;
          var moreCount = maxCount - this.projects.length;

          // Add the invited projects
          this.databaseService.getLists('/user-project').snapshotChanges().pipe(
            map(changes => 
              changes.map(c => ({ key: c.payload.key, ...c.payload.val() })).filter(data => data.userid == this.currentUser.uid)
            )
          ).subscribe(data => {
            if (data) {
              this.invitedProjects = [];
              data.forEach(item => {
                this.databaseService.getRowDetails('/projects', item.projectid).valueChanges().subscribe(project => {
                  project.key = item.projectid;

                  if (this.invitedProjects.length < moreCount) {
                    this.invitedProjects.push(project);
                  }
                  
                });
                
              });
            }
          });

        }

      }
    });
    
  }

  gotourl(url) {
    this.router.navigate([url]);
  }

}
