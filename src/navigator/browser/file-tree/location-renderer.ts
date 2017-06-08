/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { h } from '@phosphor/virtualdom';
import { VirtualRenderer } from "../../../application/browser";
import URI from "../../../application/common/uri";
import { LocationModel, LocationService } from "./location-service";

export const LOCATION_LIST_CLASS = 'theia-LocationList';

export class LocationListRenderer extends VirtualRenderer {

    protected readonly service: LocationService;

    constructor(
        readonly model: LocationModel,
        host?: HTMLElement
    ) {
        super(host);
        this.service = new LocationService(model);
    }

    protected onRender(): void {
        const locationList = this.locationList;
        if (locationList) {
            const currentLocation = this.model.currentLocation;
            locationList.value = currentLocation ? currentLocation.toString() : '';
        }
    }

    protected doRender(): h.Child {
        const locations = this.service.allLocations.reverse();
        const options = locations.map(value => this.renderLocation(value));
        return h.select({
            className: LOCATION_LIST_CLASS,
            onchange: e => this.onLocationChanged(e)
        }, ...options);
    }

    protected renderLocation(uri: URI): h.Child {
        const value = uri.toString();
        return h.option({
            value
        }, uri.lastSegment);
    }

    protected onLocationChanged(e: Event): void {
        const locationList = this.locationList;
        if (locationList) {
            const value = locationList.value;
            const uri = new URI(value);
            this.model.currentLocation = uri;
        }
        e.preventDefault();
        e.stopPropagation();
    }

    get locationList(): HTMLSelectElement | undefined {
        const locationList = this.host.getElementsByClassName(LOCATION_LIST_CLASS)[0];
        if (locationList instanceof HTMLSelectElement) {
            return locationList;
        }
        return undefined;
    }

}