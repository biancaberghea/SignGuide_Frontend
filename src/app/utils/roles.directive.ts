import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject, takeUntil } from "rxjs";
import { Role } from './model/roles';
import { AuthorizationService } from './service/authorization.service';

@Directive({
  selector: '[hasRoles]',
  standalone: true
})
export class HasRolesDirective implements OnDestroy {

  @Input() set hasRoles(roles: Role[]) {
    this.updateView(roles);
  }
  private isHidden = false;

  private _directiveDestroy$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService
  ) { }

  ngOnDestroy(): void {
    this._directiveDestroy$.next();
    this._directiveDestroy$.complete();
  }

  private updateView(roles: Role[]) {
    this.authorizationService.userRoles$
      .pipe(takeUntil(this._directiveDestroy$))
      .subscribe(() => {
        this.authorizationService
          .hasRoles(roles)
          .then((result: boolean) => {
            if (result && !this.isHidden) {
              this.viewContainer.createEmbeddedView(this.templateRef);
              this.isHidden = true;
            } else if (!result && this.isHidden) {
              this.viewContainer.clear();
              this.isHidden = false;
            }
          });
      });
  }

}
