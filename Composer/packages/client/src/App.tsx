import React, { forwardRef } from 'react';
import { Fragment, useContext, useEffect, useState } from 'react';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import formatMessage from 'format-message';

import { Header } from './components/Header';
import { NavItem } from './components/NavItem';
import { BASEPATH } from './constants';
import Routes from './router';
import { StoreContext } from './store';
import { main, sideBar, content, divider, globalNav, leftNavBottom, rightPanel, dividerTop } from './styles';
import { resolveToBasePath } from './utils/fileUtil';
import { CreationFlow } from './CreationFlow';

initializeIcons(undefined, { disableWarnings: true });

// eslint-disable-next-line react/display-name
const Content = forwardRef<HTMLDivElement>((props, ref) => <div css={content} {...props} ref={ref} />);

const topLinks = [
  {
    to: '/home',
    iconName: 'Home',
    labelName: 'Home',
    activeIfUrlContains: 'home',
    exact: true,
  },
  {
    to: '/dialogs/Main',
    iconName: 'SplitObject',
    labelName: 'Design Flow',
    activeIfUrlContains: 'dialogs',
    exact: false,
  },
  {
    to: '/test-conversation',
    iconName: 'WaitListConfirm',
    labelName: 'Test Conversation',
    activeIfUrlContains: '',
    exact: false,
    underTest: true, // will delete
  },
  {
    to: 'language-generation/',
    iconName: 'Robot',
    labelName: 'Bot Says',
    activeIfUrlContains: 'language-generation',
    exact: false,
  },
  {
    to: 'language-understanding/',
    iconName: 'People',
    labelName: 'User Says',
    activeIfUrlContains: 'language-understanding',
    exact: false,
  },
  {
    to: '/evaluate-performance',
    iconName: 'Chart',
    labelName: 'Evaluate performance',
    activeIfUrlContains: '',
    exact: false,
    underTest: true, // will delete
  },
  {
    to: '/setting/',
    iconName: 'Settings',
    labelName: 'Settings',
    activeIfUrlContains: 'setting',
    exact: false,
  },
];

const bottomLinks = [
  {
    to: '/help',
    iconName: 'unknown',
    labelName: 'Info',
    activeIfUrlContains: '/help',
    exact: false,
    underTest: true, // will delete
  },
  {
    to: '/about',
    iconName: 'info',
    labelName: 'About',
    activeIfUrlContains: '/about',
    exact: false,
  },
];

export const App: React.FC = () => {
  const { state, actions } = useContext(StoreContext);
  const [sideBarExpand, setSideBarExpand] = useState(false);
  const { botName, creationFlowStatus } = state;
  const { fetchProject, setCreationFlowStatus } = actions;
  const mapNavItemTo = x => resolveToBasePath(BASEPATH, x);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    await fetchProject();
  }

  return (
    <Fragment>
      <Header botName={botName} />
      <div css={main}>
        <nav css={sideBar(sideBarExpand)}>
          <div>
            <IconButton
              iconProps={{
                iconName: 'GlobalNavButton',
              }}
              css={globalNav}
              onClick={() => {
                setSideBarExpand(!sideBarExpand);
              }}
              data-testid={'LeftNavButton'}
              ariaLabel={sideBarExpand ? formatMessage('Collapse Nav') : formatMessage('Expand Nav')}
            />
            <div css={dividerTop} />{' '}
            {topLinks.map((link, index) => {
              return (
                <NavItem
                  key={'NavLeftBar' + index}
                  to={mapNavItemTo(link.to)}
                  iconName={link.iconName}
                  labelName={link.labelName}
                  labelHide={!sideBarExpand}
                  index={index}
                  exact={link.exact}
                  targetUrl={link.activeIfUrlContains}
                  underTest={link.underTest}
                />
              );
            })}
          </div>
          <div css={leftNavBottom}>
            <div css={divider(sideBarExpand)} />{' '}
            {bottomLinks.map((link, index) => {
              return (
                <NavItem
                  key={'NavLeftBar' + index}
                  to={mapNavItemTo(link.to)}
                  iconName={link.iconName}
                  labelName={link.labelName}
                  labelHide={!sideBarExpand}
                  index={index}
                  exact={link.exact}
                  targetUrl={link.activeIfUrlContains}
                  underTest={link.underTest}
                />
              );
            })}
          </div>
        </nav>
        <div css={rightPanel}>
          <CreationFlow creationFlowStatus={creationFlowStatus} setCreationFlowStatus={setCreationFlowStatus} />
          <Routes component={Content} />
        </div>
      </div>
    </Fragment>
  );
};