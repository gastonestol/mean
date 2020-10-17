import { AuthService } from './../../auth/auth.service';
import { PostService } from './../post.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [ 1, 2, 5, 10];
  isUserAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSubscription: Subscription;

  constructor(public postsService: PostService, private authService: AuthService) {}


  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe( (postData: {posts: Post[], postsCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postsCount;
        this.posts = postData.posts;
      });
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authStatusSubscription = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }
  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () =>{
      this.isLoading = false;
    });
  }
  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }
}
