import React, { Component } from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

import queryString from 'query-string';
import YouTube from 'react-youtube';

import {authorizeUrl, getPlaylists, getPlaylistTracks} from '../api/spotify';
import {search} from '../api/youtube';

export default class IndexPage extends Component {
  constructor(props) {
    super(props);

    let step = 1;
    let accessToken = null;

    // handle Spotify authroization flow
    const parsedHash = queryString.parse(this.props.location.hash);
    if (parsedHash['access_token']) {
      step = 2;
      accessToken = parsedHash['access_token'];
    }

    this.state = {
      step: step,
      accessToken: accessToken,
      playlists: [],
      playlistSelected: null,
      playlistSelectedTracks: [],
      video: null,
    }

    this.handleSpotifyConnect = this.handleSpotifyConnect.bind(this);
    this.handlePlaylistClick = this.handlePlaylistClick.bind(this);

  }

  async componentDidMount() {
    if (this.state.accessToken) {
      const playlists = await getPlaylists(this.state.accessToken);
      this.setState({
        playlists: playlists,
      });
    }
  }

  handleSpotifyConnect() {
    window.location.replace(authorizeUrl(this.props.location));
  }

  async handlePlaylistClick(playlist) {
    const tracks = await getPlaylistTracks(this.state.accessToken, playlist.tracks.href);
    this.setState({
      step: 3,
      playlistSelected: playlist,
      playlistSelectedTracks: tracks,
    });
  }

  async youtubeSearch(track) {
    let searchTerms = [track.track.name];

    track.track.artists.map((artist) => {
      return searchTerms.push(artist.name);
    })

    searchTerms.push("Official Music Video");

    const data = await search(searchTerms);
    if (data.items.length) {
      this.setState({
        video: data.items[0],
      })
    } else {
      alert("There was a problem.....");
    }
  }

  render() {
    return (
      <Layout>
        <SEO
          title="Home"
          keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        />

        <div className="text-center">

          { this.state.step === 1 &&
            <div>
              <h2 className="bg-yellow inline-block my-8 p-3">
                Hey there! Welcome to SpotYou.
              </h2>

              <p>
                To get started, click the button below to connect your spotify account.
              </p>

              <button
                onClick={() => this.handleSpotifyConnect() }
              >
                Connect your Spotify Account!
              </button>
            </div>
          }

          { this.state.step === 2 &&
            <div>
              <p className="leading-loose">
                Your playlists are below:
              </p>
              {
                this.state.playlists.map(function(playlist, index) {
                  return (
                    <div className="pb-10" key={index} onClick={() => this.handlePlaylistClick(playlist)}>
                      <div>{playlist.name}</div>
                      <img src={playlist.images[0].url} style={{maxHeight: 100}} alt={playlist.name}/>
                    </div>
                  )
                }, this)
              }
            </div>
          }

          { this.state.step === 3 &&
            <div>
              <p className="leading-loose">
                You have selected : {this.state.playlistSelected.name}
              </p>
              <div className="flex">
                <div className="w-1/2">
                  { this.state.video &&
                    <div className="fixed">
                      { this.state.video.snippet.title }
                      <YouTube
                        videoId={this.state.video.id.videoId}
                        opts={{
                          width: 300,
                          height: 200,
                        }}
                      />
                    </div>
                  }
                </div>
                <div className="w-1/2">
                  {
                    this.state.playlistSelectedTracks.map(function(track, index) {
                      return (
                        <div className="pb-10" key={index} onClick={() => this.youtubeSearch(track)}>
                          <div>{track.track.name}</div>
                          <div>
                          {
                            track.track.artists.map(function(artist, index) {
                              return (
                                <div key={index}>{artist.name}</div>
                              )
                            },this)
                          }
                          </div>
                        </div>
                      )
                    }, this)
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </Layout>
    );
  }
}
