import React from 'react';
import classNames from 'classnames';
import sass from '../scss/index.scss';


class GridScroll extends React.Component {
  constructor(props) {
    super(props);

    this.onClickScrollTrack = this.onClickScrollTrack.bind(this);
  }

  /*
  // 사실상 항상 리랜더 해야 하는 컴포넌트라서 제어하지 않을 작정
    shouldComponentUpdate(nextProps, nextState) {
      let sameProps = false;

      for(const k in this.props){
        if(typeof nextProps[k] === "undefined" || nextProps[k] !== this.props[k]){
          sameProps = true;
        }
      }

      return sameProps;
    }
  */

  onClickScrollTrack(e, barName) {
    e.preventDefault();
    if (e.target.getAttribute("data-scroll")) {
      this.props.onClickScrollTrack(e, barName);
    }
  }

  render() {
    const refCallback              = this.props.refCallback,
          onMouseDownScrollBar     = this.props.onMouseDownScrollBar,
          mounted                  = this.props.mounted,
          bodyHeight               = this.props.bodyHeight,
          pageHeight               = this.props.pageHeight,
          pageButtonGroupWidth     = this.props.pageButtonGroupWidth,
          verticalScrollerHeight   = this.props.verticalScrollerHeight,
          verticalScrollerWidth    = this.props.verticalScrollerWidth,
          horizontalScrollerWidth  = this.props.horizontalScrollerWidth,
          horizontalScrollerHeight = this.props.horizontalScrollerHeight,
          verticalScrollBarHeight  = this.props.verticalScrollBarHeight,
          horizontalScrollBarWidth = this.props.horizontalScrollBarWidth,
          scrollerArrowSize        = this.props.scrollerArrowSize,
          scrollerPadding          = this.props.scrollerPadding,
          scrollBarLeft            = this.props.scrollBarLeft,
          scrollBarTop             = this.props.scrollBarTop;

    if (!mounted) return null;

    if (verticalScrollerWidth === 0 && horizontalScrollerHeight === 0) return null;

    let verticalArrowStyles = {
      width: verticalScrollerWidth,
      height: scrollerArrowSize
    };
    let verticalStyles = {
      width: verticalScrollerWidth,
      height: verticalScrollerHeight + scrollerPadding * 2 + scrollerArrowSize * 2,
      bottom: pageHeight,
      padding: scrollerPadding,
      paddingTop: scrollerArrowSize + scrollerPadding
    };
    let verticalBarStyles = {
      height: verticalScrollBarHeight,
      top: scrollBarTop
    };
    let horizontalArrowStyles = {
      width: scrollerArrowSize,
      height: horizontalScrollerHeight
    };
    let horizontalStyles = {
      width: horizontalScrollerWidth + scrollerPadding * 2 + scrollerArrowSize * 2,
      height: horizontalScrollerHeight,
      bottom: (pageHeight - 1 - horizontalScrollerHeight) / 2,
      right: (pageHeight - 1 - horizontalScrollerHeight) / 2,
      padding: scrollerPadding,
      paddingLeft: scrollerArrowSize + scrollerPadding
    };
    let horizontalBarStyles = {
      width: horizontalScrollBarWidth,
      left: scrollBarLeft
    };
    let cornerStyle = {
      width: verticalScrollerWidth,
      height: horizontalScrollerHeight,
      bottom: pageHeight - horizontalScrollerHeight - 1
    };

    return (
      <div className={classNames(sass.gridScroller)}>
        {(verticalScrollerWidth) ? (
          <div data-scroll-track="vertical" style={verticalStyles}>
            <div data-scroll-arrow="up" style={verticalArrowStyles} />
            <div data-scroll="vertical"
                 ref={ref => refCallback("vertical-scroll-track", ref)}
                 onClick={e => this.onClickScrollTrack(e, "vertical")}>
              <div className={classNames(sass.scrollBar)}
                   style={verticalBarStyles}
                   onMouseDown={e => onMouseDownScrollBar(e, "vertical")} />
            </div>
            <div data-scroll-arrow="down" style={verticalArrowStyles}  />
          </div>
        ) : null}
        {(horizontalScrollerHeight) ? (
          <div data-scroll-track="horizontal" style={horizontalStyles}>
            <div data-scroll-arrow="left" style={horizontalArrowStyles}  />
            <div data-scroll="horizontal"
                 ref={ref => refCallback("horizontal-scroll-track", ref)}
                 onClick={e => this.onClickScrollTrack(e, "horizontal")}>
              <div className={classNames(sass.scrollBar)}
                   style={horizontalBarStyles}
                   onMouseDown={(e) => onMouseDownScrollBar(e, "horizontal")} />
            </div>
            <div data-scroll-arrow="right" style={horizontalArrowStyles}  />
          </div>
        ) : null}

      </div>
    )

  }
}

export default GridScroll;


/*
{(verticalScrollerWidth && horizontalScrollerHeight) ? (<div data-scroll="corner" style={cornerStyle} />) : null}
 */