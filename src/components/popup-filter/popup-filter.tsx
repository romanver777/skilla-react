import React, { RefObject, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as selectors from "../../store/selectors";
import { TAppDispatch } from "../../store/store";
import { setActiveFilterCalls } from "../../store/filter-calls-reducer";

import style from "./popup-filter.module.scss";

type TProps = {
  name: string;
  list?: string[];
  onHandleClick: () => void;
  itemRef: RefObject<HTMLDivElement>;
};

const PopupFilter = ({ name, list, onHandleClick, itemRef }: TProps) => {
  const dispatch: TAppDispatch = useDispatch();
  const activeFilter = useSelector(selectors.getFilterCallsByName(name));
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Element) &&
        e.target !== itemRef.current
      ) {
        onHandleClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const onFilterClick = (item: string) => {
    if (item !== activeFilter) dispatch(setActiveFilterCalls({ name, item }));
    onHandleClick();
  };

  return (
    <div className={style.popup} ref={popupRef}>
      <ul className={style.list}>
        {list?.map((item) => {
          const liStyle =
            item === activeFilter
              ? style.item + " " + style["item_active"]
              : style.item;
          return (
            <li
              key={item}
              className={liStyle}
              onClick={() => onFilterClick(item)}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PopupFilter;
