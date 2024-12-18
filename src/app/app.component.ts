import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CurrentUserService } from '@/app/shared/services/current-user-service.service';
import { HeaderComponent } from '@/app/shared/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private currentUserService: CurrentUserService) {}

  title = 'angular-test';

  ngOnInit(): void {
    this.currentUserService.setCurrentUser();
  }
}
