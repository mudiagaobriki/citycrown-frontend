import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { MENU_PLACEMENT } from 'constants.js';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { layoutShowingNavMenu } from 'layout/layoutSlice';
import {FaCoins, FaUserCircle} from "react-icons/fa";
import {selectIsLoggedIn} from "../../auth/authSlice";

const NavUserMenuContent = () => (
  <div>
    <Row className="mb-3 ms-0 me-0 text-center">
      <Col xs="12" className="ps-1 mb-2">
        <div className="text-extra-small text-primary">ACCOUNT</div>
      </Col>
      <Col xs="12" className="ps-1 pe-1">
        <ul className="list-unstyled">
          <li className="mb-2">
            <a href="#/!">My Profile</a>
          </li>
          <li>
            <a style={{cursor: 'pointer'}} onClick={() => {
                localStorage.removeItem("currentUser")
                window.location.href="/login"
            }}>
              <CsLineIcons icon="logout" className="me-2" size="17" /> <span className="align-middle">Logout</span>
            </a>
          </li>
        </ul>
      </Col>
    </Row>
  </div>
);

const NavUserMenuDropdownToggle = React.memo(
  React.forwardRef(({ onClick, expanded = false, user = {}, balance=0 }, ref) => (
      <>
          <FaUserCircle size={70} color="white" className="mb-2 align-self-center" />
          <a
              href="#/!"
              ref={ref}
              className="d-flex user position-relative"
              data-toggle="dropdown"
              aria-expanded={expanded}
              onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClick(e);
              }}
          >
              {/* <div className="name font-weight-bold mb-2"> */}
              {/*    <span style={{fontSize: 18}}> */}
              {/*        {`${user?.firstName  } ${  user?.lastName}`} */}
              {/*    </span> */}
              {/* </div> */}
              {/* <button type="button" className="btn btn-lh btn-white align-items-center" style={{borderRadius: 30}}> */}
              {/*    <FaCoins size={15} color="black" style={{marginRight: 10}} /> ${balance >0 ? balance: "0.00"} */}
              {/* </button> */}
          </a>
      </>
  ))
);

// Dropdown needs access to the DOM of the Menu to measure it
const NavUserMenuDropdownMenu = React.memo(
  React.forwardRef(({ style, className }, ref) => {
    return (
      <div ref={ref} style={style} className={classNames('dropdown-menu dropdown-menu-end user-menu wide', className)}>
        <NavUserMenuContent />
      </div>
    );
  })
);

NavUserMenuDropdownMenu.displayName = 'NavUserMenuDropdownMenu';

const MENU_NAME = 'NavUserMenu';

const NavUserMenu = () => {
  const dispatch = useDispatch();
  const {
    placementStatus: { view: placement },
    behaviourStatus: { behaviourHtmlData },
    attrMobile,
    attrMenuAnimate,
  } = useSelector((state) => state.menu);

  const { isLogin, currentUser } = useSelector((state) => state.auth);
  const { color } = useSelector((state) => state.settings);
  const { showingNavMenu } = useSelector((state) => state.layout);

  const [balance, setBalance] = useState(0);

  const [loggedInUser, setLoggedInUser] = useState({})


  useEffect(() => {
      // console.log("Current User Keys Length: ", Object.keys(currentUser)?.length)
      if (Object.keys(currentUser)?.length > 0){
          setLoggedInUser(currentUser)
          setBalance(currentUser?.balance);
      }
      else{
          setLoggedInUser(JSON.parse(localStorage?.getItem("currentUser")))
          // console.log(JSON.parse(localStorage?.getItem("currentUser")))
      }
  },[])

  const onToggle = (status, event) => {
    if (event && event.stopPropagation) event.stopPropagation();
    else if (event && event.originalEvent && event.originalEvent.stopPropagation) event.originalEvent.stopPropagation();
    dispatch(layoutShowingNavMenu(status ? MENU_NAME : ''));
  };

  useEffect(() => {
    dispatch(layoutShowingNavMenu(''));
    // eslint-disable-next-line
  }, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

  // if (!isLogin) {
  //   return <></>;
  // }
  return (
    <Dropdown as="div" bsPrefix="user-container d-flex" onToggle={onToggle} show={showingNavMenu === MENU_NAME} drop="down">
        {balance > 0 && <Dropdown.Toggle as={NavUserMenuDropdownToggle} user={loggedInUser} balance={Number(balance).toLocaleString()} />}
      <Dropdown.Menu
        as={NavUserMenuDropdownMenu}
        className="dropdown-menu dropdown-menu-end user-menu wide"
        popperConfig={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: () => {
                  if (placement === MENU_PLACEMENT.Horizontal) {
                    return [0, 7];
                  }
                  if (window.innerWidth < 768) {
                    return [-84, 7];
                  }

                  return [-78, 7];
                },
              },
            },
          ],
        }}
      />
    </Dropdown>
  );
};
export default React.memo(NavUserMenu);
