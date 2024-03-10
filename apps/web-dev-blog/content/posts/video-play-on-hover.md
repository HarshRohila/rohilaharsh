---
title: "Implementing YouTube's feature - Play video on thumbnail hover"
date: 2024-03-10T09:29:13+05:30
author: 'Harsh Rohila'
draft: false
featured_image: '/img/hover-thumbnail.gif'
---

Today I implemented a feature of YouTube in my [app](https://rohilaharsh.in/youtube-frontend). This feature will play video on hover of the thumbnail of a video.

![Demo of feature](/img/hover-thumbnail.gif)

## Code Changes

[This commit](https://github.com/HarshRohila/youtube-frontend/commit/a8ba39c8ba87e75d55c71d883b2a4081b5b22ae2) is having the changes I did for implementing this feature.

## Implementation Explaination

- I have used template like below for showing thumbnail card for videos

```html
<div class="card">
  <img class="thumbnail" src={this.thumbnail}></img>
  <div class="video-preview">
    {this.stream && this.showVideoPreview && (
      <video-player sources={this.stream.sources} muted={true}></video-player>
    )}
  </div>
</div>
```

- In this template, "stream" is the video stream data used for playing videos, "muted" is used to play videos in mute by default.
- "showVideoPreview" controls when to render "video-player" component. I am using different states for stream data and showing video preview, because data is being cached, so to avoid rendering video-player whenever stream data is available, additional state "showVideoPreview" is used.
- Now we just need to set these 2 states (stream and showVideoPreview) based on some logic.
- I used RxJS to simplify writing async logic. We are interested in mouseenter and mouseleave events on card.

```ts
const card = document.querySelector('.card')

const mouseLeave$ = fromEvent(card, 'mouseleave')
const mouseEnter$ = fromEvent(card, 'mouseenter')
```

- Now I want to fetch stream data on mouseenter. But I don't want to immediately make network requests for it as soon as mouseenter occurs. Because user can quickly move its mouse and it can trigger mouseenter on too many cards, which will make too many network requests and app would get slow. To avoid this we can wait for sometime for mouse to rest on one card, I used 300ms time for that. So if mouse rests for more than 300ms on a card it should start fetching stream data. This logic looks like below.

```ts
const videoStream$ = mouseEnter$.pipe(
  switchMap(() => timer(300).pipe(takeUntil(mouseLeave$))),
  switchMap(this.getStream)
)

videoStream$.pipe(untilDestroyed(this, 'disconnectedCallback')).subscribe(stream => {
  this.stream = stream
})
```

- Here, "getStream" makes API call to get stream data. "takeUntil" operator is used to avoid emitting data of timer, if mouseleave occurs before timer emits. Then, "videoStream$" is subscribed until component is disconnected (disconnectedCallback of component is called).
- Now we have set one state "stream". only one more state is remaining, that is "showVideoPreview".
- We want to show video preview when we get data from "videoStream$" and want to hide preview on mouseleave or when component is destroyed. This logic looks like below.

```ts
const showVideoPreview$ = videoStream$.pipe(map(() => true))
const hideVideoPreview$ = merge(mouseLeave$, this.destroy$).pipe(map(() => false))

merge(showVideoPreview$, hideVideoPreview$)
  .pipe(untilDestroyed(this, 'disconnectedCallback'))
  .subscribe(value => {
    this.showVideoPreview = value
  })
```

- Here "destroy$" emits when component is destroyed. Show and hide observables/streams are merged in single stream to set state "showVideoPreview".

And we are done. Hope this is informative.
