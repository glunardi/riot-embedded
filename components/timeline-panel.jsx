import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import EventTile from './event-tile.jsx';
import ThemeContext from './theme-context.jsx';

/**
 * React component for the room timeline
 * 
 * @param   {string} homeserver - The homeserver URL
 * @param   {object} room - The room object
 * @param   {object} client - The client object
 * @param   {array} children - Children of room timeline
 * @param   {func} replyTo - Callback for setting reply 
 * @param   {boolean} canWrite - If client can send messages
 * @param   {boolean} isGuest - If client is in guest mode
 * @param   {func} showReceipts - Callback to show read receipts
 * @param   {string} typingText - Prompt about currently typing users
 */
export default class TimelinePanel extends PureComponent {
    static propTypes = {
        homeserver: PropTypes.string.isRequired, // Homeserver URL
        room: PropTypes.object, // Room object
        client: PropTypes.object, // Client object
        children: PropTypes.array, // Children of the room body
        replyTo: PropTypes.func, // Callback for setting reply
        canWrite: PropTypes.bool, // If client can send messages
        isGuest: PropTypes.bool, // If client is in guest mode
        showReceipts: PropTypes.func, // Callback to show read receipts
        typingText: PropTypes.string, // Prompt about currently typing users
    };

    constructor(props) {
        super(props);

        this.oldRoomId = this.props.room ? this.props.room.roomId : null;
        this.attachedToBottom = true;
        this.updated = false;

        this.loadPrevious = this.loadPrevious.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    componentDidUpdate() {
        if ( !(this.props.room) ) return;
        let timelineBody = document.getElementById('timeline-body');
        
        if (!this.updated) {
            let height = document.getElementById('timeline-list').clientHeight;
            this.loadPrevious(height);
        }

        // Scroll to bottom on room change or message
        if ( this.props.room.roomId !== this.oldRoomId || 
            this.attachedToBottom ) {
            this.attachedToBottom = true;
            let height = timelineBody.clientHeight;
            timelineBody.scrollTop += height + 999999;
            this.oldRoomId = this.props.room.roomId;

            // Send read receipt
            if (this.props.room.timeline.lengh > 0) {
                const timelineLength = this.props.room.timeline.lengh;
                let lastEvent = this.props.room.timeline[timelineLength - 1];
                this.props.client.sendReadReceipt(lastEvent, {hidden: false});
            }
        }

        // Load messages if timeline not filled
        if (timelineBody.scrollTop <= 0) {
            let height = timelineBody.clientHeight;
            this.loadPrevious(height);
        }
    }

    /** Load older messages */
    loadPrevious(oldHeight) {
        this.updated = true;
        let loader = document.getElementById('timeline-loading');
        
        // Hide loader if at end of timeline
        if (this.props.room.oldState.paginationToken == null) {
            loader.style.display = 'none';
            return;
        }

        // Show loader
        loader.style.display = 'block';
        
        this.props.client.scrollback(this.props.room, 30, () => {
            // Hide loader
            loader.style.display = 'none';

            let timelineList = document.getElementById('timeline-list');
            let newHeight = timelineList.clientHeight;
            let timelineBody = document.getElementById('timeline-body');
            
            // Scroll to original position (position += diff in height)
            let change = newHeight - oldHeight;
            timelineBody.scrollTop += change;
            
            // If scrolled to top or not fully scrolled to top or
            // if change in height is less than threshold (300)
            if (timelineBody.scrollTop <= 0 || 
                change < 300) {
                this.loadPrevious(newHeight);
            }
        });
    }

    /** Check if scrolled to top of timeline */
    onScroll(event) {
        let timelineBody = event.target;
        // Get old height
        let timelineList = document.getElementById('timeline-list');
        let oldHeight = timelineList.clientHeight;
        let maxScroll = timelineBody.scrollHeight - timelineBody.clientHeight;

        if (timelineBody.scrollTop <= 0) {
            this.loadPrevious(oldHeight);
        } else if (timelineBody.scrollTop >= maxScroll) {
            this.attachedToBottom = true;
        } else this.attachedToBottom = false;
    }

    // Consume theme context
    static contextType = ThemeContext;
    render() {
        let theme = this.context;

        // Construct timeline from room
        let timeline = [];
        if (this.props.room) {
            for (let event of this.props.room.timeline) {
                timeline.push(
                    <EventTile key={event.event.event_id} 
                        homeserver={this.props.homeserver}
                        mxEvent={event} client={this.props.client}
                        replyTo={this.props.replyTo} 
                        canWrite={this.props.canWrite}
                        isGuest={this.props.isGuest}
                        showReceipts={this.props.showReceipts} />
                ); 
            }
        }
        
        return (
            <div className='main-body'>
                <div className={
                    `bg-primary-${theme.theme} body-panel scrollable-${theme.theme}`
                } onScroll={this.onScroll} id='timeline-body' >
                    <div className='loader-panel'>
                        <div id='timeline-loading' className={`loader-${theme.theme}`}></div>
                    </div>
                    <ul className='list-panel' id='timeline-list' >
                        {timeline}
                        <div className='typing-panel'>
                            {this.props.typingText}
                        </div>
                    </ul>
                </div>
                {this.props.children}
            </div>
        );
    }
}
